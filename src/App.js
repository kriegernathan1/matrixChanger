import { useState } from 'react';
import './App.css';

function App() {
  const [elements, setElements] = useState(() => 
  {
    // Check local storage for an array of integers for initial configuration
    const restoreConfiguration = window.localStorage.getItem("Configuration")

    var inital_config = restoreConfiguration == null ? [1,2,3,4,5,6,7,8,9] : JSON.parse(restoreConfiguration);
    
    inital_config = inital_config.map((element, index) => {
      return <SomeElem name={Number(element)} key={Number(element)}/>
    });

    return inital_config;
  });

  const [inputValue, setInputValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const [orderIndexMap, setIndexMap] = useState( () => {
    const restoreConfiguration = window.localStorage.getItem("Configuration")
    var inital_index = restoreConfiguration == null ? [1,2,3,4,5,6,7,8,9] : JSON.parse(restoreConfiguration);

    let orderIndexMap = {}

    inital_index.forEach((item, index) => {
      orderIndexMap[item] = index;
    })

    return orderIndexMap;
  });



  /**
 * 
 * @param {Array<Number>} unsanitized_input: input directly from textbox
 * @returns {object} : javascript object that defines the result as error with a message or success
 */
const isValidSubmitInput = unsanitized_input => {
    //correct length. Must be of length 9
    if(unsanitized_input.length !== 9)
      return {
        result: "error",
        message: `Length of input must be 9 charcters not ${unsanitized_input.length}. Please Try Again`
      }
      
    const re = /^[1-9\b]+$/;

    //only numeric input
    if(!re.test(unsanitized_input) && unsanitized_input.length > 0)
    {
      return {
        result: "error",
        message: "Input must only be numeric digits (1-9)"
      }
    }

    let hasDuplicate = arr => {return new Set(arr).size !== arr.length;}

    if(hasDuplicate(unsanitized_input.split("")))
      return {
        result: "error",
        message: "Each numeric character (1-9) must only be inputted once. Please Try Again."
      }

    return {
      result: "Success",
      message: 'Correct Input'
    }

  }

  const isValidChangeInput = unsanitized_input => {
    const re = /^[1-9\b]+$/;

    //only numeric input
    if(!re.test(unsanitized_input) && unsanitized_input !== '')
    {
      return {
        result: "error",
        message: "Input must only be numeric digits (1-9)"
      }
    }
  
  
    return ({
      result: "Success",
      message: 'Correct Input'
    });
  
  }

  /**
   * on change checks if input is valid and updates state accordingly
   * @param {Event Object} event 
   * @param {Setter function}
   * @returns void
   */
  const handleChange = event => {
    let unsanitized_input = event.target.value;

    const isValidResult = isValidChangeInput(unsanitized_input);

    if(isValidResult.result === "Success")
    {
      setErrorMessage("");
      setInputValue(event.target.value);
    }
    else
    {
      setErrorMessage(isValidResult.message);
    }

  }

  const updateOrder = (event) => {
    let isValidSubmit = isValidSubmitInput(inputValue);

    if(isValidSubmit.result !== "Success")
    {
      setErrorMessage(isValidSubmit.message);
      return;
    }
    else{
      setErrorMessage("");
  
      let new_order = inputValue.split("");
      let newElements = []

      for(let i = 0; i < elements.length; i++)
      {
        //locate current component and it's index with elements state variable
        let component_wanted = new_order[i];
        let component_index = orderIndexMap[component_wanted];

        //assing to new array
        newElements[i] = elements[component_index];

        //update index of current component
        orderIndexMap[component_wanted] = i
        setIndexMap(orderIndexMap)
      }
    
      setElements(newElements)
    }
    
  }

  const saveConfiguration = () => {
    // create an array that represents configuration of matrix elements
    console.log(Number(elements[0].key));
    const configuration = [];

    elements.forEach((item, index) => {
      configuration[index] = elements[index].key
    })

    window.localStorage.setItem("Configuration", JSON.stringify(configuration))
  }

  const placeHolder = "Please Enter 9-digit number"

  return (
    <div className="App">
      <h2 className='intro-message'> Order Components </h2>

      {errorMessage.length > 0 &&
        <p className='error-message'>{errorMessage}</p>
      }
      
      <input type='text' value={inputValue} placeholder={placeHolder} className='text-input' onChange={ handleChange }/>

      <input className='submit-input' type='submit' onClick={ updateOrder }/>
      <input className='save-input' type='submit' value='Save Configuration' onClick={saveConfiguration} />

      <div className='matrix-container'>
        {elements}
      </div>
    </div>
  );
}

const SomeElem = props => {

  var css_class = `${props.name} element`;
  return(

    <div className={css_class}>
      <h2>{props.name}</h2>
    </div>
  )
}


export default App;
