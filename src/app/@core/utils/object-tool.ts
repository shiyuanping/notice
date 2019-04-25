export class ObjectTool {
  static simplify(obj: Object) {
    const propNames =  Object.getOwnPropertyNames(obj);
    propNames.forEach( name => {
      const prop = obj[name];
      if (prop === null || prop === undefined) {
        delete(obj[name]);
      }
    });
    return obj;
   }

   static distinct<T>(arr: Array<T>, getProperty?: (para: T) => any) {
     if (getProperty) {
        return arr.filter((u, index) => {
          if (arr.findIndex(v => getProperty(v) === getProperty(u)) === index) {
            return true;
          } else {
            return false;
          }
        });
     } else {
      return arr.filter((u, index) => {
        if (arr.findIndex(v => v === u) === index) {
          return true;
        } else {
          return false;
        }
      });
     }
   }
}
