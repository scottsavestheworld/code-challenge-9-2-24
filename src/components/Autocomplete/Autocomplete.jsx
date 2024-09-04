import { useEffect, useRef, useState } from "react";
import { blogData } from "./data/blogPostData";
import './Autocomplete.css';


const Autocomplete = () => {
  // Used to track the actively hovered item (via both mouse or keypress).
  const [activeResult, setActiveResult] = useState(-1);
  // Tracks the input's value.
  const [inputValue, setInputValue] = useState('');
  // Allows the component to recognize when the input is focused (for styling).
  const [isFocused, setIsFocused] = useState(false);
  // Shows the results dropdown.
  const [isShowingResults, setIsShowingResults] = useState(true);
  // Array of items matching the input requirements.
  const [results, setResults] = useState([]);

  const autocompleteRef = useRef(null);

  useEffect(() => {
    const handleOffClick = (event) => {
      if (
        autocompleteRef.current &&
        isShowingResults &&
        !autocompleteRef.current.contains(event.target)
      ) {
        setActiveResult(-1);
        setIsShowingResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleOffClick);
    document.addEventListener('mousedown', handleOffClick);

    return () => {
      document.removeEventListener('mousedown', handleOffClick);
    }
  }, [isShowingResults]);

  const handleFocus = () => {
    setActiveResult(-1);
    setIsFocused(true);
    setIsShowingResults(true);
  }

  const handleKeyDown = (event) => {
    const { key } = event;
    const hasResults = !!results.length;
  
    switch (key) {
      case 'Enter':
        if (hasResults && isShowingResults && activeResult > -1) {
          event.preventDefault();
          handleResultClick(activeResult)();
        } else if (hasResults) {
          setIsShowingResults(true)
        }
        break;
      case 'ArrowDown': {
        event.preventDefault();
        if (hasResults && isShowingResults && activeResult < results.length -1) {
          setActiveResult(activeResult + 1);
        } else if (hasResults) {
          setIsShowingResults(true)
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (hasResults && isShowingResults && activeResult > -1) {
          setActiveResult(activeResult - 1);
        }
        break;
      }
      case 'Escape':
      case 'Tab': {
        setIsShowingResults(false);
        break;
      }
      default:
        setActiveResult(-1);
    }
  }
 
  // Necessary to prevent highlighting two items at the same time with both keyboard and mouse
  const handleResultHover = (index) => () => {
    setActiveResult(index);
  };

  const handleResultClick = (index) => () => {
    setInputValue(results[index].title);
    setActiveResult(-1);
    setResults([]);
  };

  const handleUserInput = (event) => {
    const newInputValue = event.target.value;
    
    const inputResults = blogData.filter((blog) => {
      if (newInputValue === '') return false;

      const titleToLower = blog.title.toLowerCase();
      const inputToLower = newInputValue.toLowerCase();

      return titleToLower.indexOf(inputToLower) === 0;
    });

    inputResults.sort((a, b) => a.title.localeCompare(b.title));

    setResults(inputResults)
    setInputValue(newInputValue);
  };

  const getResults = () => {
    return results.map((result, index) => {
      const { date, id, title } = result;

      const classList = ['result'];
      if (index === activeResult) classList.push('is-active');
      const classNames = classList.join(' ');

      return (
        <div
          className={classNames}
          key={id}
          onClick={handleResultClick(index)}
          onMouseMove={handleResultHover(index)}
        >
          <div className="title">{title}</div>
          <div className="date">{date}</div>
        </div>
      );
    });
  };

  const classList = ['Autocomplete'];
  if (!!inputValue) classList.push('has-value');
  if (isFocused) classList.push('is-focused');
  const classNames = classList.join(' ');

  return (
    <div className={classNames} ref={autocompleteRef}>
      <div className="input-container">
        <label htmlFor="autocomplete">
          Blog Posts
        </label>
        <input
          id="autocomplete"
          // onBlur={handleBlur}
          onFocus={handleFocus}
          onInput={handleUserInput}
          onKeyDown={handleKeyDown}
          type="text"
          value={inputValue}
        />
      </div>
      {
        !!results.length && isShowingResults &&
        <div
          className="results"
          id="results-list"
        >
          {getResults()}
        </div>
      }
    </div>
  )
};

export default Autocomplete;
