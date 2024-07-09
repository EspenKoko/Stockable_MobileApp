import { Component, OnInit } from '@angular/core';

import { NavController, PopoverController } from '@ionic/angular';

import { PopoverPage } from '../about-popover/about-popover';
import { QuotesService } from '../../services/quotes-service.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['./about.scss'],
})
export class AboutPage implements OnInit{
  location = 'durban';
  date = '2030-05-17';

  selectOptions = {
    header: 'Select a Location'
  };
  quote: string;
  author: string;

  constructor(public popoverCtrl: PopoverController,
    private navCtrl: NavController, 
    private quotesService: QuotesService) { }

  ngOnInit() {
    this.generateRandomQuote();  // Generate a random quote on component initialization
  }
  
  async presentPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      event
    });
    await popover.present();
  }

  generateRandomQuote() {
    const randomQuote = this.quotesService.getRandomQuote();
    this.quote = randomQuote.quote;
    this.author = randomQuote.author;
  }

  shareOnTwitter() {
    const tweet = `Check out this quote by ${this.author}: "${this.quote}"`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    window.open(twitterUrl, '_blank');
  }

  doRefresh(event) {
    // Reload the page with the animation
    this.navCtrl.navigateRoot('/app/tabs/about', { animationDirection: 'forward' });

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
