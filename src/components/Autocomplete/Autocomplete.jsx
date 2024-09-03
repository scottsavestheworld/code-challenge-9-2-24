import { useState } from "react";
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

  // This is hacky due to time constraints. It prevents the results from clearing
  // when the input loses focus. This happens when a result tile is mouse clicked,
  // causing the results to be cleared before the click is registered. The correct 
  // way to do this is to track component off-clicks & tab presses to hide the results, 
  // rather than when the input is blurred.
  
  let showResultsTimeout = undefined;

  const handleBlur = () => {
    clearTimeout(showResultsTimeout);
    setIsFocused(false)
    showResultsTimeout = setTimeout(() => setIsShowingResults(false), 300);
  }

  const handleFocus = () => {
    clearTimeout(showResultsTimeout);
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
        }
        break;
      case 'ArrowDown': {
        if (hasResults && isShowingResults && activeResult < results.length -1) {
          event.preventDefault();
          setActiveResult(activeResult + 1);
        }
        break;
      }
      case 'ArrowUp': {
        if (hasResults && isShowingResults && activeResult > 0) {
          event.preventDefault();
          setActiveResult(activeResult - 1);
        }
        break;
      }
      default:
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
    <div className={classNames}>
      <div className="input-container">
        <label htmlFor="autocomplete">
          Blog Posts
        </label>
        <input
          id="autocomplete"
          onBlur={handleBlur}
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
