import { api, LightningElement, track, wire } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";
import tableaujs from "@salesforce/resourceUrl/tableaujs";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { gql, graphql } from "lightning/uiGraphQLApi";

export default class TableauViewComp extends LightningElement {
  @track tableauVizUrl;
  @api height = "600px";
  @api width = "100%";

  @track viz;
  @track isLibLoaded = false;
  @track errorMessage;
  @track selectedValue;
  errors;
  @track dashboardList = [];

  handleChange(event) {
    this.selectedValue = event.detail.value;
    this.tableauVizUrl = event.detail.value;
    this.reloadViz();
  }
  reloadViz() {
    if (this.viz) {
      this.viz.dispose();
    }
    this.initializeViz();
  }

  get hasUrl() {
    return this.tableauVizUrl !== undefined && this.tableauVizUrl !== null;
  }

  @wire(graphql, {
    query: gql`
      query getDashboardMdt {
        uiapi {
          query {
            Dashboard_List__mdt {
              edges {
                node {
                  Id
                  Label {
                    value
                  }
                  URL__c {
                    value
                  }
                }
              }
            }
          }
        }
      }
    `
  })
  graphqlQueryResult({ data, errors }) {
    if (data) {
      const result = data.uiapi.query.Dashboard_List__mdt.edges.map(
        (edge) => edge.node
      );

      this.dashboardList = result.map((item) => {
        return {
          label: item.Label.value,
          value: item.URL__c.value
        };
      });
    }
    this.errors = errors;
  }

  renderedCallback() {
    if (this.isLibLoaded) {
      return;
    }
    this.isLibLoaded = true;
    // console.log("Attempting to load Tableau JS API...");
    Promise.all([loadScript(this, tableaujs)])
      .then(() => {
        this.initializeViz();
        // console.log("Tableau JS API loaded successfully with all the files.");
      })
      .catch((error) => {
        this.errorMessage = error;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error loading Tableau JS API",
            message: error.message,
            variant: "error"
          })
        );
      });
  }

  initializeViz() {
    console.log("initializeViz() is executed.");
    const tableau = window.tableau;
    if (!tableau) {
      //   console.error("⚠️ Tableau global object not available!");
      return;
    }

    if (typeof tableau === "undefined") {
      console.error("tableau object is still undefined!");

      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error",
          message:
            "Tableau JS API failed to load. Reason: Tableau js api not assigned.",
          variant: "error"
        })
      );
      return;
    }
    const containerDiv = this.template.querySelector(
      'div[data-label="tableau-view"]'
    );
    if (!containerDiv) {
      console.warn('Container div with data-label="tableau-view" not found.');
      return;
    }
    const options = {
      hideTabs: true,
      hideToolbar: false,
      width: this.width,
      height: this.height,
      onFirstInteractive: function () {
        console.log("Tableau viz is interactive!");
      }
    };

    if (this.tableauVizUrl) {
      try {
        this.viz = new tableau.Viz(containerDiv, this.tableauVizUrl, options);
        console.log("Tableau viz has initialited and is being populated!");
      } catch (vizError) {
        console.error(
          "Error and Exception occurred creating Tableau Viz:",
          vizError
        );
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message:
              "An error occurred while creating the Tableau visualization: " +
              vizError.message,
            variant: "error"
          })
        );
      }
    } else {
      console.log("Tableau viz URL is not defined!");
    }
  }

  disconnectedCallback() {
    if (this.viz) {
      this.viz.dispose();
      this.viz = null;
    }
  }
}
