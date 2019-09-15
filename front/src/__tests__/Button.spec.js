import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

import { Button } from '@/components';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe("Button component", () => {
  it('should render without crashing', () => {
    act(() => {
      ReactDOM.render(<Button>Test</Button>, container);
    });
  });

  it('should have expected content', () => {
    const textContent = 'Test';

    act(() => {
      ReactDOM.render(<Button>{textContent}</Button>, container);
    });

    const button = container.querySelector('button');
    expect(button.textContent).toBe(textContent);
  });
});
