import React from 'react'

class BaseComponent extends React.Component {

    componentDidMount() {
        // console.log("BaseComponent didmount")
    }

    componentDidUpdate(prevProps, prevState) {
      enableFoundation();
      console.log("BaseComponent didupdate")
    }

}
export default BaseComponent
