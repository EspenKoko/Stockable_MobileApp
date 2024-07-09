import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  private quotes = [
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      quote: "Code is like humor. When you have to explain it, it’s bad.",
      author: "Cory House"
    },
    {
      quote: "The best error message is the one that never shows up.",
      author: "Thomas Fuchs"
    },

    {
      quote: "Code always seems to rot faster than you expect.",
      author: "John Carmack"
    },
    {
      quote: "Simplicity is the soul of efficiency.",
      author: "Austin Freeman"
    },

    {
      quote: "First, solve the problem. Then, write the code.",
      author: "John Johnson"
    },
    {
      quote: "The only true wisdom is in knowing you know nothing.",
      author: "Socrates"
    },
    {
      quote: "Simplicity is the soul of efficiency.",
      author: "Austin Freeman"
    },
    {
      quote: "The best way to predict the future is to invent it.",
      author: "Alan Kay"
    }
  ];

  getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }


}
