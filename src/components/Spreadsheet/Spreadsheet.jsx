import { useState } from "react";
import './Spreadsheet.css';

const Spreadsheet = () => {
  const rowIDs = ['A', 'B', 'C', 'D'];
  const initialRowState = { A: '', B: '', C: '', D: '' };

  const [calculatedValues, setCalculatedValues] = useState(initialRowState);
  const [inputValues, setInputValues] = useState(initialRowState);

  const handleBlur = () => {
    const calculated = { ...inputValues };

    const resolveValue = (rowID, path) => {
      let results = calculated[rowID];

      // Bail if there are any circular references.
      if (path.includes(rowID)) {
        return null;
      }

      const branchPath = [...path, rowID];

      // Check to see if calculated values have unresolved references.
      if (/[A-D]/.test(calculated[rowID])) {
        // Create an array of unresolved references and attempt to find values.
        const referencedRows = calculated[rowID].split('');
        const referenceValues = referencedRows.map((referenceRow) => resolveValue(referenceRow, branchPath));

        // Add the references' values together.
        results = referenceValues.reduce((total, value) => {
          if (value === '') return total;
          if (total === '') return parseFloat(value);
          return total += parseFloat(value);
        }, '').toString()
      }

      // The only time we'll see NaN is when we return null when a circular reference
      // is detected, due to the input restrictions in handleKeyDown()
      calculated[rowID] = results === 'NaN' ? 'CIRCULAR REFERENCE!' : results;

      return calculated[rowID];
    }

    Object.keys(calculated).forEach((rowID) => resolveValue(rowID, []));

    setCalculatedValues(calculated);
  };

  const handleChange = (event) => {
    const row = event.target.id;
    const input = event.target.value.toUpperCase();

    // Update both user input and calculated values to match the input.
    // The calculated values will be resolved on blur.
    setInputValues({ ...inputValues, [row]: input })
    setCalculatedValues({ ...calculatedValues, [row]: input });
  };

  const handleFocus = (event) => {
    // Return the input to display the user input, rather than the calculated amount.
    const { id } = event.target;

    setCalculatedValues({ ...calculatedValues, [id]: inputValues[id] })
  };

  const handleKeyDown = (event) => {
    const { target: { id, value }, key } = event;
    const input = event.target;

    const allContentIsSelected = input.selectionStart === 0 && input.selectionEnd === input.value.length;
    const decimalIsAllowed = key === '.' && !value.includes('.');
    const keyIsNumber = /[0-9.]/.test(key);
    const keyIsTargetRowID = key.toUpperCase() === id;
    // Prevent users from referencing the current input as its own value
    const keyIsRowID = rowIDs.includes(key.toUpperCase());
    const keyIsValid = /[A-D0-9]/i.test(key) || decimalIsAllowed;
    const valueIsNumber = /[0-9.]/.test(value);
    const valueIsRowID = /[A-D]/i.test(value);
    // Prevent users from entering both numbers and rows in the same column.
    const valueAndKeyAreMismatched = ((keyIsNumber && valueIsRowID) || (keyIsRowID && valueIsNumber));

    if (keyIsValid || key === 'Backspace' || key === 'Tab') {
      if ((!allContentIsSelected && valueAndKeyAreMismatched) || keyIsTargetRowID) {
        event.preventDefault();
      }
    } else {
      if (key === 'Enter') {
        if (!valueIsNumber) {
          input.blur();
        }
      }

      event.preventDefault();
    }
  };

  const createRows = () => (
    rowIDs.map((rowID) => {
      const hasCalculatedValue = calculatedValues[rowID] !== '';
      const hasSumFormula = /[A-D]/i.test(inputValues[rowID]);
      const displayedValue = hasCalculatedValue ? calculatedValues[rowID] : inputValues[rowID];
      
      return (
        <tr key={rowID}>
          <td><label htmlFor={rowID}>Row {rowID}</label></td>
          <td>
            <input
              id={rowID}
              onBlur={handleBlur}
              onChange={handleChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              value={displayedValue}
            />
          </td>
          { hasSumFormula && <td className="formula">ƒ {inputValues[rowID]}</td>}
        </tr>
      );
    })
  );

  return (
    <table className="Spreadsheet">
      <tbody>
        {createRows()}
      </tbody>
    </table>
  );
};

export default Spreadsheet;
