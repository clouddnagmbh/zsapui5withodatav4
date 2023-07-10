sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"
],
    function (Controller, JSONModel, MessageBox, History) {
        "use strict";

        return Controller.extend("at.clouddna.zsapui5withodatav4.controller.Detail", {

            aFragments: {},

            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("Detail").attachPatternMatched(this.onPatternMatched, this);
                this.getOwnerComponent().getRouter().getRoute("Create").attachPatternMatched(this.onCreatePatternMatched, this);
            },

            onPatternMatched: function (oEvent) {
                let oArguments = oEvent.getParameters().arguments,
                    sPath = decodeURIComponent(oArguments.path);
                this.getView().bindElement(sPath);
                this.oEditModel = new JSONModel({
                    editMode: false,
                    create: false
                });
                this.getView().setModel(this.oEditModel, "editModel");
                this._loadFragment("Display");
            },

            onCreatePatternMatched: function (oEvent) {
                let oModel = this.getView().getModel(),
                    oListBinding = oModel.bindList("/ZRAP_CV_BOOKS"),
                    oCreateContext = oListBinding.create();

                oCreateContext.created().then((oNewContext) => {
                    this.getView().bindElement(this.oCreateContext.getPath());
                });

                this.oEditModel = new JSONModel({
                    editMode: true,
                    create: true
                });
                this.getView().setModel(this.oEditModel, "editModel");
                this._loadFragment("Edit");
            },


            onEditPressed: function () {
                this._onSwitchEdit();
            },
            
            _onSwitchEdit: function () {
                let bNewMode = !this.oEditModel.getProperty("/editMode");
                this.oEditModel.setProperty("/editMode", bNewMode);
                this._loadFragment(bNewMode ? "Edit" : "Display");
            },

            _loadFragment: function (sFragmentName) {
                this.getView().byId("page").removeAllContent();
                if (this.aFragments[sFragmentName]) {
                    this.getView().byId("page").addContent(this.aFragments[sFragmentName]);
                } else {
                    sap.ui.core.Fragment.load({
                        id: sap.ui.core.Fragment.createId(this.getView().getId(), sFragmentName),
                        fragmentName: "at.clouddna.zsapui5withodatav4.view.fragment." + sFragmentName,
                        type: "XML",
                        controller: this
                    }).then((oFragment) => {
                        this.aFragments[sFragmentName] = oFragment;
                        this.getView().byId("page").addContent(oFragment);
                    });
                }
            },

            onSavePressed: function () {
                this.getView().getModel().submitBatch("$auto").then(
                    () => {
                        sap.m.MessageToast.show("Successfully saved!");
                        this.getView().getModel().refresh();
                        this._onSwitchEdit();
                    },
                    () => {
                        sap.m.MessageToast.show("An error occured!");
                    }
                );
            },

            onCancelPressed: function () {
                this.getView().getModel().resetChanges();
                this._onSwitchEdit();
            },

            onEditToggled: function (oEvent) {
                let bNewMode = !this.oEditModel.getProperty("/editMode");

                this.oEditModel.setProperty("/editMode", bNewMode);

                if (!oEvent.getParameters().editable) {
                    this.onCancelPressed();
                }
            },

            onDeletePressed: function () {
                let oBinding = this.getView().getElementBinding().getBoundContext(),
                    i18nModel = this.getView().getModel("i18n"),
                    oResourceBundle = i18nModel.getResourceBundle(),
                    sText = oResourceBundle.getText("deleteQuestion");

                MessageBox.confirm(sText, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: (sAction) => {
                        if (MessageBox.Action.YES === sAction) {
                            oBinding.delete().then(() => {
                                this.onNavBack();
                            },
                                (oError) => {
                                    sap.m.MessageToast.show("An error occured!");
                                }
                            );
                        }
                    }
                });
            },

            onNavBack: function () {
                let oHistory = History.getInstance(),
                    sPreviousHash = oHistory.getPreviousHash();
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    let oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("Main", {}, true);
                }
            }

        });
    });
