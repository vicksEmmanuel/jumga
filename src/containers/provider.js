import React from "react";
import { Subscribe } from "unstated";
import allStores from "./index";

export default WrappedComponent => {
  
  const subscribeWrapper = ({ ...props }) => (

    <Subscribe to={allStores}>
        {(
          layoutStore,
          footballStore,
          userStore,
        ) => (
          <WrappedComponent
            layoutStore={layoutStore}
            footballStore={footballStore}
            userStore={userStore}
            {...props}
          />
        )}
    </Subscribe>

  )

  return subscribeWrapper;
};
