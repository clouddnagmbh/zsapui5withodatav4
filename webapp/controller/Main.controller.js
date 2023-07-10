sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("at.clouddna.zsapui5withodatav4.controller.Main", {
            onInit: function () {

            },

            ratingStateFormatter: function(iRating){
                if(iRating < 3){
                    return "Error";
                }else if(iRating < 4){
                    return "Warning";
                }else{
                    return "Success";
                }
            },

            ratingIconFormatter: function(iRating){
                if(iRating < 3){
                    return "sap-icon://message-error";
                }else if(iRating < 4){
                    return "sap-icon://message-warning";
                }else{
                    return "sap-icon://message-success";
                }
            },

            onNavToDetail: function(oEvent){
                let oRouter = this.getOwnerComponent().getRouter();

                let oSource = oEvent.getSource(),
                    oBindingContext = oSource.getBindingContext(),
                    sPath = oBindingContext.getPath(),
                    oObject = oBindingContext.getObject();
                    
                oRouter.navTo("Detail", {
                    path: encodeURIComponent(sPath)
                });
            },

            onCreatePressed: function() {
                let oRouter = this.getOwnerComponent().getRouter();

                oRouter.navTo("Create");
            }
            
        });
    });
