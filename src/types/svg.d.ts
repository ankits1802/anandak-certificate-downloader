declare module "*.svg" {
    import React from "react";
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
    const src: string;
    export { ReactComponent };
    export default src;
  }
  