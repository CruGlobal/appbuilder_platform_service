import ABEmitter from "../../../ABEmitter.js";

/**
 * Minimal ClassUI stub for server-side web plugin bases (no webix).
 */
export default class ClassUI extends ABEmitter {
   constructor(base, ids, AB = null) {
      super();

      this.ids = {};

      if (base) {
         if ("string" == typeof base) {
            this.ids = {
               component: base,
            };
         } else {
            this.ids = base;
            base = this.ids.base ?? this.ids.component;
         }
      }

      if (ids) {
         Object.keys(ids).forEach((k) => {
            if (ids[k]) {
               return (this.ids[k] = ids[k]);
            }
            this.ids[k] = `${base}_${k}`;
         });
      }

      Object.keys(this.ids).forEach((k) => {
         this.ids[k] = this.ids[k] || `${base}_${k}`;
      });

      this.ids.component = this.ids.component || base;

      if (AB) {
         this.AB = AB;
      }
   }

   static CYPRESS_REF() {
      // no-op on server
   }

   ui() {
      return { id: this.ids?.component };
   }

   label(key, ...params) {
      if (this.AB?.Label) {
         return this.AB.Label(key, ...params);
      }
      return key;
   }
}
