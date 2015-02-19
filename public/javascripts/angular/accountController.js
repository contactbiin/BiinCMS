var biinAppAccount = angular.module('biinAppAccount',['ngRoute','ui.checkbox']);

biinAppAccount.controller("accountController",['$scope', '$http',function($scope,$http){

  $scope.wizardPosition=1;
  $scope.selectedOrganization='';
  $scope.isDefaultOrganization=false;

  $http.get('/api/accounts/').success(function(data){
    $scope.account = data.data;

    //Verify the Fields
    if(!('profilePhoto' in $scope.account.profile)){
    	$scope.account.profile.profilePhoto="";
    }
    if(!('lastName' in $scope.account.profile))
      $scope.account.profile.lastName=""; 

    if(!('phoneNumber' in $scope.account.profile))
      $scope.account.profile.phoneNumber=""; 
  });


  //Change the wizard to an specific option
  $scope.changeWizardTo = function(index){
  	$scope.wizardPosition=index;
  }

  $scope.changeProfileImage=function(image){
    $scope.account.profile.profilePhoto=image+ '?' + new Date().getTime();;

    //Apply the changes
    $scope.$digest();
    $scope.$apply();
  }

  $scope.changeOrganizationImage=function(media){
    $scope.organizations[$scope.selectedOrganization].media =[];
    $scope.organizations[$scope.selectedOrganization].media.push(media);

    //Apply the changes
    $scope.$digest();
    $scope.$apply();
  }

  $scope.changeOrganizationToDefault=function(){
    $scope.isDefaultOrganization= !$scope.isDefaultOrganization;
    var organizationId = $scope.isDefaultOrganization ? $scope.organizations[$scope.selectedOrganization].identifier: "";
    $scope.account.profile.defaultOrganization=organizationId;
    $http.post('api/accounts/'+organizationId+'/default').success(function(data,status){
      if(status===200){ 
        setOrganization();
        $scope.succesSaveShow=true;
      }else
        $scope.errorSaveShow=true;
    });                

  }
  /*********************  Organization Methods ********************/

  //Get the organizations of the Account
  $http.get('api/organizations').success(function(data){
    $scope.organizations = data.data;
    $scope.currentModelId = null;
    $scope.organizationId= null;
  });

 /**** 
    Methods
  ****/
  //Push a new organization in the list
  $scope.createOrganization = function(){
    //Get the Mayor from server
    $http.post('api/organizations/').success(function(org,status){
      if(status==201 || status==200){
        $scope.organizations.push(org);    
        $scope.editOrganization($scope.organizations.indexOf(org)); 
      }else
      {
        displayErrorMessage(org,"Organizations Creation",status)
      }
    });    
  }

  //Edit an site
  $scope.editOrganization = function(index){

    $scope.selectedOrganization = index;
    $scope.currentModelId = $scope.organizations[index].identifier;
    $scope.organizationId =$scope.organizations[index].identifier;
    $scope.isDefaultOrganization= $scope.organizations[index].identifier===$scope.account.profile.defaultOrganization;
    //$scope.clearValidations();
    //$scope.wizardPosition=1;
    //$scope.validate(true);
  }

  //Remove showcase at specific position
  $scope.removeOrganizationAt = function(index){
    //clearSelectedOrganization();
    if($scope.selectedOrganization==index){
      $scope.selectedOrganization =null;
      $scope.currentModelId =null;

    }
    var organizationId = $scope.organizations[index].identifier;      
      $scope.organizations.splice(index,1);
      $http.delete('api/organizations/'+organizationId).success(function(data){
          if(data.state=="success"){
            //Todo: implement a pull of messages
          }
        }
      );
  }


  //Save the Profile Settings
  $scope.save=function(){
    $http.put('api/accounts',{model:$scope.account.profile}).success(function(data,status){
      if(status===200){      
        $scope.succesSaveShow=true;
      }else
        $scope.errorSaveShow=true;
    });                
  }

  //Update the changes of the Selected Organization
  $scope.saveOrganization=function(){
    if(typeof($scope.currentModelId)!=='undefined' && $scope.currentModelId !== null && $scope.selectedOrganization>=0){
      $http.put('api/organizations/'+$scope.currentModelId,{model:$scope.organizations[$scope.selectedOrganization]}).success(function(data,status){
        if(status===200){
          $scope.organizations[$scope.selectedOrganization] = data;
          $scope.succesSaveShow=true;
        }else
          $scope.errorSaveShow=true;
      });        
    }
              
  }

  //Clear selected organization
  clearSelectedOrganization= function(){
    var $organizationEl =$("#organizationNav");
    $organizationEl.addClass("hide");
    $organizationEl.attr("data-organization",'');
  }

  //Set the organization selected
  setOrganization = function(){
    if($scope.organizations[$scope.selectedOrganization]){
      setOrganizationMenu($scope.currentModelId, $scope.organizations[$scope.selectedOrganization].name)
    }
  }

}]);

//Upload the profile Image
biinAppAccount.directive('uploadProfileImage',function(){
  return{
    restrict:'A',
    link:function(scope, element, attrs){
      var $inputFileElement=$(attrs['uploadProfileImage']);

        //Change event when an image is selected
        $inputFileElement.on('change',function(){
          console.log("Change beginning the upload");

            var files = $inputFileElement[0].files;
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
              var mediaFile = files[i];
              mediaFile.originalFilename=files[i].name;
              formData.append('file', mediaFile);
            }

            //Upload The media information

            //scope.loadingImagesChange(true);
            // now post a new XHR request
            var xhr = new XMLHttpRequest();

            xhr.open('POST', 'api/imageProfile');
            xhr.onload = function (data) {
              if (xhr.status === 200) {
                var obj= $.parseJSON(xhr.response);

                scope.changeProfileImage(obj.data);                

                console.log('all done: ' + xhr.status);
                //scope.loadingImagesChange(false);
              } else {
                console.log('Something went terribly wrong...');
              }
            };

            xhr.upload.onprogress = function (event) {
              if (event.lengthComputable) {
                var complete = (event.loaded / event.total * 100 | 0);
                //progress.value = progress.innerHTML = complete;
              }
            };

            xhr.send(formData);
          
        })
        //Click event of the style button
        $(element[0]).on('click touch',function(e){          
          $inputFileElement.trigger('click');
        });
    }
  }
});

//Upload the profile Image
biinAppAccount.directive('uploadOrganizationImage',function(){
  return{
    restrict:'A',
    link:function(scope, element, attrs){
      var $inputFileElement=$(attrs['uploadOrganizationImage']);

        //Change event when an image is selected
        $inputFileElement.on('change',function(){
          console.log("Change beginning the upload");

            var files = $inputFileElement[0].files;
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
              var mediaFile = files[i];
              mediaFile.originalFilename=files[i].name;
              formData.append('file', mediaFile);
            }

            //Upload The media information

            //scope.loadingImagesChange(true);
            // now post a new XHR request
            var xhr = new XMLHttpRequest();

            var organization=scope.currentModelId;

            xhr.open('POST', 'api/organizations/'+organization+"/image");
            xhr.onload = function (data) {
              if (xhr.status === 200) {
                var obj= $.parseJSON(xhr.response);

                scope.changeOrganizationImage(obj.data);                

                console.log('all done: ' + xhr.status);
                //scope.loadingImagesChange(false);
              } else {
                console.log('Something went terribly wrong...');
              }
            };

            xhr.upload.onprogress = function (event) {
              if (event.lengthComputable) {
                var complete = (event.loaded / event.total * 100 | 0);
                //progress.value = progress.innerHTML = complete;
              }
            };

            xhr.send(formData);
          
        })
        //Click event of the style button
        $(element[0]).on('click touch',function(e){          
          $inputFileElement.trigger('click');
        });
    }
  }
});