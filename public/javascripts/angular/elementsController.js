var biinAppObjects = angular.module('biinAppElements',['ngRoute','angularSpectrumColorpicker','ui.slimscroll','naturalSort','biin.services','ui.checkbox','datePicker','angular-bootstrap-select']);

biinAppObjects.controller("elementsController",['$scope', '$http','categorySrv','gallerySrv','stickersSrv',function($scope,$http,categorySrv,gallerySrv,stickersSrv){
  
  //Constants
  $scope.maxMedia=0;

  //Draggable Properties
  $scope.dragCategoryIndex =-1;
  $scope.dragGalleryIndex=-1;  
  $scope.selectedElement=null;
  $scope.currentModelId = null;
  $scope.organizationId=selectedOrganization();
  $scope.activeTab ='details';
  $scope.newTagField="";
  $scope.activeValue='1';

  //Loading images service propertie
  $scope.loadingImages =false;

  //Wizard validations indicatos
  $scope.wizard0IsValid = false;
  $scope.wizard1IsValid = false;
  $scope.wizard2IsValid =false;
  $scope.wizard3IsValid =false;
  $scope.wizard4IsValid =false;
  $scope.wizard5IsValid =false;
  $scope.wizard6IsValid =false;
  $scope.wizard7IsValid = false;

  //Boolean values 
  $scope.hasListPriceBool=false;
  $scope.hasDiscountBool=false;
  $scope.hasTimmingBool =false;
  $scope.hasQuantityBool=false;

  //Get the List of Objects
  $http.get('api/organizations/'+$scope.organizationId+'/elements').success(function(data){
  	$scope.elements = data.data.elements;    
    if($scope.elements && $scope.elements != null &&  $scope.elements.length>0){
      
      //Select the first element
      $scope.edit(0);  

    } 
  });	

  //Push a new showcase in the list
  $scope.create = function(){
    $http.post('api/organizations/'+$scope.organizationId+"/elements").success(function(element,status){
      if(status==201){
        $scope.elements.push(element);
        $scope.wizardPosition=0;
        $scope.clearValidations();
        $scope.edit($scope.elements.indexOf(element));
      }else{
        displayErrorMessage(element,"Element Creation",status);
      }
    });
  }

  //Edit an element
  $scope.edit = function(index){

    $scope.selectedElement = index;
    $scope.currentModelId = $scope.elements[index].elementIdentifier;

    //Set the Booleans Values
    $scope.hasListPriceBool= $scope.elements[index].hasListPrice==='1';
    $scope.hasDiscountBool= $scope.elements[index].hasDiscount==='1';
    $scope.hasTimmingBool= $scope.elements[index].hasTimming==='1';
    $scope.hasQuantityBool= $scope.elements[index].hasQuantity==='1';

    $scope.clearValidations();
    $scope.wizardPosition=0;
    $scope.validate(true); 

  }

  //Select Element Type function
  $scope.selectType=function(index){
    if($scope.elements[$scope.selectedElement].elementType!==''+index)
      $scope.elements[$scope.selectedElement].elementType=""+index;
    else
      $scope.elements[$scope.selectedElement].elementType="";

    $scope.validate(true);

  }

  //Remove element at specific position
  $scope.removeElementAt = function(index){
    if($scope.selectedElement==index){
      $scope.selectedElement =null;
      $scope.currentModelId =null;
    }

    var elementId = $scope.elements[index].elementIdentifier;      
    $scope.elements.splice(index,1);
    $http.delete('api/organizations/'+$scope.organizationId+'/elements/'+elementId).success(function(data){
        if(data.state=="success"){
          //Todo: implement a pull of messages
        }
      }
    );
  }

  //Save detail model object
  $scope.save= function(){  
    $http.put('api/organizations/'+$scope.organizationId+'/elements/'+$scope.currentModelId,{model:$scope.elements[$scope.selectedElement]}).success(function(data,status){
      if("replaceModel" in data){
        console.log("save")
        $scope.elements[$scope.selectedElement] = data.replaceModel;
        $scope.elementPrototype =  $.extend(true, {}, $scope.elementPrototypeBkp);
      }
      if(data.state=="success")
        $scope.succesSaveShow=true;
    });          
  } 

  //Change Wizad tab manager
  $scope.changeWizardTab=function(option){
    switch(option){
      case 1:
        if($scope.wizard0IsValid)
          $scope.wizardPosition =option;
      break;
      case 2:
        if($scope.wizard1IsValid)
          $scope.wizardPosition =option;        
      break      
      case 3:
        if($scope.wizard1IsValid&& $scope.wizard2IsValid)
          $scope.wizardPosition =option;
          $scope.wizard3IsValid=true;
      break  
      case 4:
        if($scope.wizard1IsValid&& $scope.wizard2IsValid && $scope.wizard3IsValid && $scope.elements[$scope.selectedElement].elementType === '1')
          $scope.wizardPosition =option;
      break 
      case 5:
        if($scope.wizard1IsValid&& $scope.wizard2IsValid && $scope.wizard3IsValid && $scope.wizard4IsValid)
          $scope.wizardPosition =option;
      break   
      case 6:
        if($scope.wizard1IsValid&& $scope.wizard2IsValid && $scope.wizard3IsValid && $scope.wizard4IsValid&& $scope.wizard5IsValid)
          $scope.wizardPosition =option;
      break   
      case 7:
        if($scope.wizard1IsValid&& $scope.wizard2IsValid && $scope.wizard3IsValid && $scope.wizard4IsValid&& $scope.wizard5IsValid && $scope.wizard6IsValid)
          $scope.wizardPosition =option;
      break               
      default:
        $scope.wizardPosition =option;
      break;        
    }

    //Validate the current option
    $scope.validate();
  }

  //Add tag information
  $scope.addElementTag=function(value){

    if(!$scope.elements[$scope.selectedElement].searchTags)
      $scope.elements[$scope.selectedElement].searchTags=[];
    
    if(value!=""){    
      //If the values is not in the array
      if($.inArray(value, $scope.elements[$scope.selectedElement].searchTags)==-1)
      {
        $scope.elements[$scope.selectedElement].searchTags.push(value);
        $scope.newTagField=""; 
      }

    }
  }

  //Remove of Site Tag
  $scope.removeElementTag=function(index){
    if($scope.elements[$scope.selectedElement].searchTags.length>index){
      $scope.elements[$scope.selectedElement].searchTags.splice(index,1);
    }
  }


  //Validations
  //Validate the steps
  $scope.validate=function(validateAll){
    var validate=typeof(validateAll)!='undefined';
    var currentValid=false;

      if(eval($scope.wizardPosition)==0 || validate){     
         $scope.wizard0IsValid= $scope.elements[$scope.selectedElement].elementType!='';
      }

      if(eval($scope.wizardPosition)==1 || validate){     
        if($scope.elements[$scope.selectedElement])
           $scope.wizard1IsValid= (typeof($scope.elements[$scope.selectedElement].title)!='undefined' && $scope.elements[$scope.selectedElement].title.length>0) && (typeof($scope.elements[$scope.selectedElement].nutshellDescriptionTitle)!='undefined' && $scope.elements[$scope.selectedElement].nutshellDescriptionTitle.length>0);
        else{
          $scope.wizard1IsValid=false; 
        }         
        currentValid = $scope.wizard1IsValid;
      }
      if(eval($scope.wizardPosition)==2 || validate){
        $scope.wizard2IsValid= (typeof($scope.elements[$scope.selectedElement].media)!='undefined' && $scope.elements[$scope.selectedElement].media.length>0);
      }

    if(eval($scope.wizardPosition)==3 || validate){
        var coloursValidation=false;        
        coloursValidation= typeof($scope.elements[$scope.selectedElement].textColor)!='undefined' && $scope.elements[$scope.selectedElement].textColor!="";
        $scope.wizard3IsValid= coloursValidation;
      }

       if(eval($scope.wizardPosition)==4 || validate){
        //If the element type is Benefit
        if($scope.elements[$scope.selectedElement].elementType==='1')
        {
          var wizard4IsValid =(typeof($scope.elements[$scope.selectedElement].price)!='undefined' && $scope.elements[$scope.selectedElement].price.length>0) && (typeof($scope.elements[$scope.selectedElement].savings)!='undefined' && $scope.elements[$scope.selectedElement].savings.length>0);
          if(eval($scope.elements[$scope.selectedElement].hasListPrice))
              wizard4IsValid=  wizard4IsValid && (typeof($scope.elements[$scope.selectedElement].listPrice)!='undefined' && $scope.elements[$scope.selectedElement].listPrice.length>0);

          if(eval($scope.elements[$scope.selectedElement].hasDiscount))
            wizard4IsValid=wizard4IsValid && (typeof($scope.elements[$scope.selectedElement].discount)!='undefined' && $scope.elements[$scope.selectedElement].discount.length>0);

          if(eval($scope.elements[$scope.selectedElement].hasTimming))
            wizard4IsValid=wizard4IsValid && (typeof($scope.elements[$scope.selectedElement].initialDate) !='undefined') && (typeof($scope.elements[$scope.selectedElement].expirationDate)!='undefined');
          
          if(eval($scope.elements[$scope.selectedElement].hasQuantity))
            wizard4IsValid=wizard4IsValid && (typeof($scope.elements[$scope.selectedElement].quantity)!='undefined' && $scope.elements[$scope.selectedElement].quantity>0);

          $scope.wizard4IsValid=wizard4IsValid;          
        } 
        else
        {
          $scope.wizard4IsValid=true;
        }

       }

       if(eval($scope.wizardPosition)==5 || validate){
        var wizard5IsValid = false;        
        if($scope.elements[$scope.selectedElement].details){
          //Validate each element
          for(var index=0;index <$scope.elements[$scope.selectedElement].details.length;index++){

            if($scope.elements[$scope.selectedElement].details[index].elementDetailType=='4'){                        
              if($scope.elements[$scope.selectedElement].details[index].body.length>0){
                //Foreach line in body validate the text
                wizard5IsValid=true;
                  for(var line=0; line<$scope.elements[$scope.selectedElement].details[index].body.length;line++){
                    wizard5IsValid= wizard5IsValid & (typeof($scope.elements[$scope.selectedElement].details[index].body[line].line)!='undefined'&& $scope.elements[$scope.selectedElement].details[index].body[line].line.length>0);
                  }
              }

            }else{
              wizard5IsValid= (typeof($scope.elements[$scope.selectedElement].details[index].text)!='undefined' && $scope.elements[$scope.selectedElement].details[index].text.length>0);
            }
          }
        }

        $scope.wizard5IsValid= wizard5IsValid;
      }

      if(eval($scope.wizardPosition)==6 || validate){
        var wizard6IsValid = false;
        if($scope.elements[$scope.selectedElement].activateNotification===$scope.activeValue ){
           wizard6IsValid=true;
          for(var i=0; i<$scope.elements[$scope.selectedElement].notifications.length;i++){
            if($scope.elements[$scope.selectedElement].notifications[i].isActive===$scope.activeValue)
              wizard6IsValid = wizard6IsValid && $scope.elements[$scope.selectedElement].notifications[i].isActive === $scope.activeValue && typeof($scope.elements[$scope.selectedElement].notifications[i].text)!=='undefined' && $scope.elements[$scope.selectedElement].notifications[i].text.length>0;
          }
        }else{
         wizard6IsValid=true; 
        }

        $scope.wizard6IsValid= wizard6IsValid; 
      }

      //Categories Validate
      if(eval($scope.wizardPosition)== 7 || validate){
        if($scope.elements[$scope.selectedElement]){
         $scope.wizard7IsValid=$scope.elements[$scope.selectedElement].categories.length>0;
        }else{
          $scope.wizard7IsValid=false; 
        }          
      }

      $scope.isValid = $scope.wizard0IsValid && $scope.wizard1IsValid && $scope.wizard2IsValid &&  $scope.wizard3IsValid &&  $scope.wizard4IsValid &&  $scope.wizard5IsValid &&  $scope.wizard6IsValid && $scope.wizard7IsValid;

      return currentValid;
  }

  //Clear the validations
  $scope.clearValidations=function(){
      $scope.isValid = false;    
      $scope.wizard1IsValid =false;
  }

  //Change tab to a specific section
  $scope.changeTabTo= function(tabToChange){
    $scope.activeTab = tabToChange;
  }

  //Get the List of Categories
  categorySrv.getList().then(function(promise){
    $scope.categories = promise.data.data;    
  });

  //Return the categories of the selected element
  $scope.ownCategories=function(){
    var categories=[];
    if($scope.elements[$scope.selectedElement] && $scope.elements[$scope.selectedElement].categories)
      categories = $scope.elements[$scope.selectedElement].categories;
    return categories;
  }


  //Set the gallery index when start draggin
  $scope.setDragGallery=function(scopeIndex){
    $scope.dragGalleryIndex= scopeIndex;
  }

 

  //Select an sticker
  $scope.selectSticker=function(index){
      if($scope.elements[$scope.selectedElement].sticker.identifier !==$scope.stickers[index].identifier){
        $scope.elements[$scope.selectedElement].sticker.identifier= $scope.stickers[index].identifier;
        $scope.elements[$scope.selectedElement].sticker.color= $scope.stickers[index].color;        
      }else{
        $scope.elements[$scope.selectedElement].sticker.identifier="";
        $scope.elements[$scope.selectedElement].sticker.color="";
      }
  }

  //Gallery Media Images

  //Insert a gallery item to site
  $scope.insertGalleryItem = function(index){
    if(($scope.elements[$scope.selectedElement].media.length < $scope.maxMedia &&  index < $scope.galleries.length && $scope.galleries[index])||$scope.maxMedia==0){
      var newObj = {};
      newObj.identifier = $scope.galleries[index].identifier;
      newObj.url = $scope.galleries[index].url;
      newObj.mainColor = $scope.galleries[index].mainColor;
      
      $scope.elements[$scope.selectedElement].media.push(newObj);  

      $scope.wizard2IsValid= typeof($scope.elements[$scope.selectedElement].media)!='undefined'&& $scope.elements[$scope.selectedElement].media.length>0;
      //Apply the changes
      $scope.$digest();
      $scope.$apply();    
    }
  } 
  
  //Remove the media object at specific index
  $scope.removeMediaAt=function(index){
    if($scope.elements[$scope.selectedElement].media.length>=index)
      $scope.elements[$scope.selectedElement].media.splice(index,1)
  }

  //Get the list of the gallery
  gallerySrv.getList($scope.organizationId).then(function(promise){
    $scope.galleries = promise.data.data;
  });

  //Get the list of stickers
  stickersSrv.getList().then(function(promise){
    $scope.stickers = promise.data.data;
  });

  //On gallery change method                
  $scope.onGalleryChange= function(obj,autoInsert){
    //Do a callback logic by caller
    $scope.galleries = $scope.galleries.concat(obj);;
    $scope.$digest();

    if(autoInsert)
    {
      //Insert the images to the preview
      var cantToInsert=$scope.maxMedia- $scope.elements[$scope.selectedElement].media.length;
      for(var i=0; i< cantToInsert; i++){
        $scope.insertGalleryItem($scope.galleries.indexOf(obj[i]));
      }      
    }
  }

  $scope.loadingImagesChange=function(state){
    $scope.loadingImages = state;
    $scope.$digest();
  }

  //Element Details Methods
  $scope.insertDetail =function(elementType){
    if(typeof($scope.elements[$scope.selectedElement].details)==='undefined')
      $scope.elements[$scope.selectedElement].details=[];
    
    var newDetail ={elementDetailType:elementType, text:"", body:[]};    
    $scope.elements[$scope.selectedElement].details.push(newDetail);

    if(elementType=='4')
       $scope.addListItem($scope.elements[$scope.selectedElement].details.indexOf(newDetail));
  }

  //Category return if contains a specific categoru
  $scope.containsCategory=function(category){
    if(typeof(_.findWhere($scope.elements[$scope.selectedElement].categories,{identifier:category.identifier}))!='undefined')
      return 'active'
    else
      return "";
  }
  //Change the state of the category relation with the Site
  $scope.switchCategoryState =function(category){
    var index =-1;
    var cat = _.findWhere($scope.elements[$scope.selectedElement].categories,{identifier:category.identifier});
    if(typeof(cat)!='undefined'){
      index=$scope.elements[$scope.selectedElement].categories.indexOf(cat);
    }

    if(index>=0)
      $scope.elements[$scope.selectedElement].categories.splice(index,1)
    else
      $scope.elements[$scope.selectedElement].categories.push(category);

    $scope.validate();
    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$apply();
        $scope.$digest();
    }
  }
  //Remove a element a specific index
  $scope.removeDetailAt=function(index){
    if($scope.elements[$scope.selectedElement].details.length>=index)
      $scope.elements[$scope.selectedElement].details.splice(index,1);
  }

  //Remove the list Item of an element
  $scope.removeListItemAt=function(detailIndex, listItemIndex){
   if($scope.elements[$scope.selectedElement].details.length>=detailIndex)
      $scope.elements[$scope.selectedElement].details[detailIndex].body.splice(listItemIndex,1);
  }

  //Add a list item of an element
  $scope.addListItem =function(detailIndex){
    $scope.elements[$scope.selectedElement].details[detailIndex].body.push({line:""});
    $scope.validate();
  }

  //Notification Section

  //Toggle notifications state
  $scope.setNotificationActive=function(){
    if($scope.elements[$scope.selectedElement].activateNotification!=='1')
      $scope.elements[$scope.selectedElement].activateNotification=$scope.activeValue;
    else
      $scope.elements[$scope.selectedElement].activateNotification='0';
    $scope.validate();
  }

  //Toggle a specific notification enabled
  $scope.setNotificationActiveAt=function(index){
    if($scope.elements[$scope.selectedElement].activateNotification==='1')
    {
      if($scope.elements[$scope.selectedElement].notifications[index].isActive!==$scope.activeValue)
        $scope.elements[$scope.selectedElement].notifications[index].isActive=$scope.activeValue;
      else
        $scope.elements[$scope.selectedElement].notifications[index].isActive='0';
    }      
    $scope.validate();
  }

 
  //Toggle the changes 
  $scope.changeBoolStateHighlights=function(model,value){
    switch(model){
      case 'hasListPrice':
          if(value)
            $scope.elements[$scope.selectedElement].hasListPrice='1'
          else
            $scope.elements[$scope.selectedElement].hasListPrice='0'          
        break;
      case 'hasDiscount':
        if(value)
            $scope.elements[$scope.selectedElement].hasDiscount='1'
          else
            $scope.elements[$scope.selectedElement].hasDiscount='0'          
        break;
        case 'hasTimming':
          if(value)
            $scope.elements[$scope.selectedElement].hasTimming='1'
          else
            $scope.elements[$scope.selectedElement].hasTimming='0'          
          break;
        case 'hasQuantity':
          if(value)
            $scope.elements[$scope.selectedElement].hasQuantity='1'
          else
            $scope.elements[$scope.selectedElement].hasQuantity='0'          
          break;
    }
    $scope.validate();
  }

}]);

//Change of image directive
biinAppObjects.directive('inputChange',function(){
  return{
    restrict:'A',
    link:function(scope,element){       
      $el = $(element);
       $el.on('change',function(e){
          var index =scope.selectedElement;
          scope.elements[index].imageUrl= $el.val();
          scope.$digest();
          scope.$apply();
       });
    }
  }
});

biinAppObjects.directive('selectPicker',function(){
  return{
    restrict:'A',
    link:function(scope,element){       
      $el = $(element).selectpicker({width:'50px'});      
    }
  }
})
;
