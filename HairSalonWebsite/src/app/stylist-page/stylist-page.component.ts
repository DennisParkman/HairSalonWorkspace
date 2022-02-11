import { Component, OnInit } from '@angular/core';
import { Stylist } from '../models/stylist.model';
import { StylistService } from '../services/stylist-service/stylist.service';

@Component(
{
  selector: 'app-stylist-page',
  templateUrl: './stylist-page.component.html',
  styleUrls: ['./stylist-page.component.scss']
})
export class StylistPageComponent implements OnInit 
{
  stylists: Stylist[] = [{name:"test", level:1,bio:"help"}, {name:"test", level:1,bio:"help"}, {name:"test", level:1,bio:"help"}];

  bio: string;
  name: string;
  level: number;

  addingStylist: boolean = false;
  loadingFinished: boolean = false;

  constructor(private stylistService: StylistService) { }

  ngOnInit(): void 
  { 
    this.stylistService.getStylists().subscribe(s => {this.stylists = s; this.loadingFinished = true; console.log(this.stylists)});
  }

  addStylist() {
    let stylist = {bio: this.bio, name: this.name, level: this.level};
    this.stylistService.addStylist(stylist);
    this.addingStylist = false;
  }

}
