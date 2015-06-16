module.exports = function() {
    //Custom Utils
    var utils = require('../biin_modules/utils')();
    var util = require('util');

    //Schemas
    var organization = require('../schemas/organization');
    var biins = require('../schemas/biin'),
        site = require('../schemas/site');
    //var regionRoutes = require('./regions')();

    var siteRoutes = require('./sites')();
    var functions = {};

    //GET the main view of sites
    functions.index = function(req, res) {
        res.render('maintenance/index', {
            title: 'Maintenance',
            user: req.user,
            isSiteManteinance: true
        });
    }

    //GET the list of organizations
    functions.getOrganizationInformation = function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        organization.find({}, {
            _id: 0,
            identifier: 1,
            biinsAssignedCounter: 1,
            accountIdentifier: 1,
            name: 1,
            brand: 1,
            description: 1,
            extraInfo: 1,
            media: 1,
            biins: 1,
            biinsCounter: 1,
            majorCounter: 1,
            sites: 1,
            purchasedBiinsHist: 1
        }).lean().exec(function(err, data) {
            var organizations = data;
            res.json(organizations);
        });
    }

    //GET the list of beacon per organization
    functions.getBiinsOrganizationInformation = function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var orgId = req.params['orgIdentifier'];
        biins.find({
            organizationIdentifier: orgId
        }, {
            _id: 0,
            identifier: 1,
            name: 1,
            major: 1,
            minor: 1,
            proximityUUID: 1,
            status: 1,
            isAssigned: 1,
            brandIdentifier: 1,
            organizationIdentifier: 1,
            siteIdentifier: 1,
            biinType: 1,
            venue: 1
        }).lean().exec(function(err, data) {
            var response = {};
            response.biins = data;
            response.defaultUUID = process.env.DEFAULT_SYS_ENVIROMENT;
            res.json(response);
        });
    }

    functions.addBiinToOrganizationModal = function(req, res) {
        res.render('maintenance/addBiinToOrganizationModal');
    }

    var biinCreate = function(req, res) {

    }

    functions.biinPurchase = function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        var beacon = req.body;


        var orgID = beacon.organizationIdentifier;
        var siteIndex = beacon.siteIndex;
        var siteLocationToUpdate = "sites." + siteIndex + ".minorCounter";
        delete beacon.siteIndex;
        var mode = beacon.mode;
        delete beacon.mode;

        //Set site category model
        var setSiteCategory = function(newBeaconModel, callback) {
            var updateOldModel = false;
            var updateNewModel = false;

            var doneProcess = function() {
                if (updateOldModel && updateNewModel)
                    callback();
            }
            biins.findOne({
                identifier: newBeaconModel.identifier
            }, function(err, oldBeaconModel) {
                if (oldBeaconModel && oldBeaconModel.siteIdentifier !== '' && oldBeaconModel.status === 'Installed' && newBeaconModel.siteIdentifier !== oldBeaconModel.siteIdentifier) {
                    organization.findOne({
                        'sites.identifier': oldBeaconModel.siteIdentifier
                    }, {
                        'sites.$': 1
                    }, function(err, siteModel) {
                        siteRoutes.setSiteCategory(true, siteModel.sites[0], siteModel.sites[0].identifier, function() {
                            updateOldModel = true;
                            doneProcess();
                        })
                    })
                } else {
                    updateOldModel = true;
                    doneProcess();
                }

                if (newBeaconModel.siteIdentifier !== '' && newBeaconModel.status === 'Installed') {
                    organization.findOne({
                        'sites.identifier': newBeaconModel.siteIdentifier
                    }, {
                        'sites.$': 1
                    }, function(err, siteModel) {
                        siteRoutes.setSiteCategory(true, siteModel.sites[0], siteModel.sites[0].identifier, function() {
                            updateNewModel = true;
                            doneProcess();
                        })
                    })
                } else {
                    updateNewModel = true;
                    doneProcess();
                }

            })
        }
        var newMinor = beacon.siteMinor;
        delete beacon.siteMinor;

        var setQuery = {};
        var incQuery = {};
        setQuery[siteLocationToUpdate] = newMinor;

        var hasError = false;
        var doneFunction = function() {
            if (hasError)
                return res.send("{\"success\":\"false\"}", 500);
            else
                return res.send("{\"success\":\"true\"}", 200);

        }

        var beaconReady = false;
        var siteCategoryReady = false;
        setSiteCategory(beacon, function() {
            siteCategoryReady = true;
            if (beaconReady && siteCategoryReady) {
                doneFunction();
            }
        });

        if (mode == "create") {
            beacon.identifier = utils.getGUID();
            incQuery["biinsAssignedCounter"] = 1;
            incQuery["biinsCounter"] = 1;
            if (beacon.biinType == "2") {
                biins.find({
                    organizationIdentifier: orgID,
                    venue: "",
                    siteIdentifier: beacon.siteIdentifier,
                    biinType: "3"
                }, {
                    _id: 0,
                    minor: 1
                }).lean().exec(function(err, data) {
                    var children = [];
                    for (var i = 0; i < data.length; i++) {
                        children.push(data[i].minor)
                    };
                    beacon.children = children;
                    biins.create(beacon, function(error, data) {
                        if (error == null) {
                            organization.update({
                                identifier: orgID
                            }, {
                                $inc: incQuery,
                                $set: setQuery
                            }, function(errorUpdate, data) {
                                if (errorUpdate !== null)
                                    hasError = true;
                                beaconReady = true;
                                if (beaconReady && siteCategoryReady) {
                                    doneFunction();
                                }
                            });
                        } else {
                            hasError = true;
                            beaconReady = true;
                            if (beaconReady && siteCategoryReady) {
                                doneFunction();
                            }
                        }
                    });

                });
            } else if (beacon.biinType == "3") {
                biins.update({
                    organizationIdentifier: orgID,
                    venue: "",
                    siteIdentifier: beacon.siteIdentifier,
                    biinType: "2"
                }, {
                    $push: {
                        children: beacon.minor
                    }
                }, {
                    multi: true
                }).exec(function(err, data) {
                    if (err) {
                        res.send("{}", 500);
                    } else {
                        biins.create(beacon, function(error, data) {
                            if (error == null) {
                                organization.update({
                                    identifier: orgID
                                }, {
                                    $inc: incQuery,
                                    $set: setQuery
                                }, function(errorUpdate, data) {
                                    if (errorUpdate !== null)
                                        hasError = true;
                                    beaconReady = true;
                                    if (beaconReady && siteCategoryReady) {
                                        doneFunction();
                                    }
                                });
                            } else {
                                hasError = true;
                                beaconReady = true;
                                if (beaconReady && siteCategoryReady) {
                                    doneFunction();
                                }
                            }
                        });
                    }
                });
            }
        } else {
            if (beacon.biinType == "2") {
                //find beacons who will be children of the new beacon
                biins.find({
                    organizationIdentifier: orgID,
                    venue: beacon.venue,
                    siteIdentifier: beacon.siteIdentifier,
                    biinType: "3"
                }, {
                    _id: 0,
                    minor: 1
                }).exec(function(err, data) {
                    if (err) {
                        hasError = true;
                        beaconReady = true;
                        if (beaconReady && siteCategoryReady) {
                            doneFunction();
                        }
                    } else {
                        var children = [];
                        for (var i = 0; i < data.length; i++) {
                            children.push(data[i].minor)
                        };
                        beacon.children = children;
                        //remove from existing children in other beacons
                        var beaconMinor = beacon.minor + "";
                        biins.update({
                            organizationIdentifier: orgID,
                            venue: beacon.venue,
                            siteIdentifier: beacon.siteIdentifier,
                            biinType: "2",
                            children: {
                                $in: [beaconMinor]
                            }
                        }, {
                            $pull: {
                                children: beaconMinor
                            }
                        }, {
                            multi: true
                        }).exec(function(err, data) {
                            if (err) {
                                hasError = true;
                                beaconReady = true;
                                if (beaconReady && siteCategoryReady) {
                                    doneFunction();
                                }
                            } else {
                                biins.update({
                                    identifier: beacon.identifier
                                }, {
                                    $set: beacon
                                }, function(error, data) {
                                    if (error == null) {
                                        organization.update({
                                            identifier: orgID
                                        }, {
                                            $set: setQuery
                                        }, function(errorUpdate, data) {
                                            if (errorUpdate !== null)
                                                hasError = true;
                                            beaconReady = true;
                                            if (beaconReady && siteCategoryReady) {
                                                doneFunction();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

            } else if (beacon.biinType == "3") {
                biins.update({
                    organizationIdentifier: orgID,
                    venue: beacon.venue,
                    siteIdentifier: beacon.siteIdentifier,
                    biinType: "2"
                }, {
                    $push: {
                        children: beacon.minor
                    }
                }, {
                    multi: true
                }).exec(function(err, data) {
                    if (err) {
                        hasError = true;
                        beaconReady = true;
                        if (beaconReady && siteCategoryReady) {
                            doneFunction();
                        }
                    } else {
                        beacon.children = [];
                        biins.update({
                            identifier: beacon.identifier
                        }, {
                            $set: beacon
                        }, function(error, data) {
                            if (error == null) {
                                organization.update({
                                    identifier: orgID
                                }, {
                                    $set: setQuery
                                }, function(errorUpdate, data) {
                                    if (errorUpdate !== null)
                                        hasError = true;
                                    beaconReady = true;
                                    if (beaconReady && siteCategoryReady) {
                                        doneFunction();
                                    }
                                });
                            }
                        });
                    }
                });

            }
        }
    }

    functions.getBeaconChildren = function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        biinType = req.headers['biintype'];
        biinvenue = req.headers['biinvenue'];
        siteId = req.headers['biinsite'];
        orgId = req.headers['biinorganization'];
        if (biinType == "2") {
            biins.find({
                organizationIdentifier: orgId,
                venue: biinvenue,
                siteIdentifier: siteId,
                biinType: "3"
            }, {
                _id: 0,
                minor: 1
            }).lean().exec(function(err, data) {
                var response = [];
                for (var i = 0; i < data.length; i++) {
                    response.push(data[i].minor)
                };
                res.json(response);
            });
        } else {
            res.json([]);
        }

    }

    return functions;
}