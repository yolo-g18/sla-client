import { useEffect, useRef } from "react";

export let useClickOutside = (handler: any) => {
    let domNode: any = useRef();
  
    useEffect(() => {
      let maybeHandler = (event: any) => {
        if (domNode.current && !domNode.current.contains(event.target)) {
          handler();
        }
      };
  
      document.addEventListener("mousedown", maybeHandler);
  
      return () => {
        document.removeEventListener("mousedown", maybeHandler);
      };
    });
  
    return domNode;
  };