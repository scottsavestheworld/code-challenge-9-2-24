import { Autocomplete, Spreadsheet } from './components';
import './App.css';

const App = () => (
  <div className="App">
    <h2>Coding Exercise #1</h2>
    <p>Let's create an autocompleting input! For this component, imagine that input is being used to search through and select a blog post. Each blog post should have an ID, title, and date. The autocomplete should have the following features:</p>
    <ol>
      <li>As you type, match the input text with the start of the title of the blog post.</li>
      <li>Each entry in the list should show the title of the post as the first line and the date as the second line of text.</li>
      <li>Style the background of each blog post as grey, with a dark divider between each item. Don’t add a divider on the last item.</li>
    </ol>
    <br />
    <Autocomplete />
    <br />
    <br />
    <h2>Coding Exercise #2</h2>
    <p>For this challenge, I want you to render four cells, respectively labeled A-D. Each cell should contain a text input that the user can type into. Each cell should also display a number. The user can type into each cell. If the text input contains a number, the cell should render that number. A cell can also contain a string satisfying the regex [A-D]+. If the input contains letters, it should show the sum of the referenced cells. For example, "AD" represents the sum of cell A and cell D.</p>
    <br />
    <Spreadsheet />
  </div>
);

export default App;
