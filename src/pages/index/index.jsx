import React from 'react';
import ReactDOM from 'react-dom';
import './index.module.css';
// Import your React components for the index page

const Index = () => {
  return (
    <div>
      <h1>starting some stuff here for index</h1>
      <img src="/img/galaxy.jpg" alt="WHYYYY? this isn't wroking"/>
      <a href="view.html">and link to views</a>
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById('index-root'));
