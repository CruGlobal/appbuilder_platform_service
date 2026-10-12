import ABViewComponent from "./ABViewComponent.js";

/**
 * Server-side container component base. Web detail/form components extend this.
 */
export default class ABViewContainerComponent extends ABViewComponent {
   constructor(baseView, idBase, ids) {
      super(baseView, idBase || `ABViewContainer_${baseView?.id}`, ids);
      this.idBase = idBase;
   }
}
