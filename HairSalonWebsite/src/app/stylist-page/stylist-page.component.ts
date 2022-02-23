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

  /*
    toggles add stylist form
  */
  showAddStylist()
  {
    this.addingStylist = true;
    console.log("show");
  }

  /*
    cancel creating stylist
  */
  cancelAddStylist()
  {
    this.clearFields(); 
    this.addingStylist = false;
  }

  /*
    clear form information
  */
  clearFields()
  {
    this.bio = "";
    this.level = 0;
    this.name = "";
  }

  /*
    send new stylist entered in form to stylist service method
  */
  addStylist() 
  {
    let stylist = {bio: this.bio, name: this.name, level: this.level};
    this.stylistService.addStylist(stylist);
    this.stylists.push(stylist);
    this.addingStylist = false;
    this.clearFields();
  }

 /*
    sort stylists by level from highest level to lowest level
  */
  sortByLevelDesending(): void
  {
    this.stylists.sort((a, b) => (a.level > b.level) ? -1 : 1);
  }

  /*
    sort stylists by level from lowest level to highest level
  */
  sortByLevelAscending(): void
  {
    this.stylists.sort((a, b) => (a.level < b.level) ? -1 : 1);
  }

  /*
    sort stylists by name in alphabetical order from A to Z
  */
  sortByNameAscending(): void
  {
    this.stylists.sort((a, b) => (a.name < b.name) ? -1 : 1);
  }

  /*
    sort stylists by name in reverse alphabetical order from Z to A
  */
  sortByNameDesending(): void
  {
    this.stylists.sort((a, b) => (a.name > b.name) ? -1 : 1);
  }

}
