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
  stylistUpdateId: any = null;

  editSytlistFunctions: boolean = false;
  addingStylist: boolean = false;
  updateSylist: boolean = false;

  stylistsLoading: boolean = true;
  

  constructor(private stylistService: StylistService) { }

  ngOnInit(): void 
  { 
    this.stylistService.getStylists().subscribe(s => 
      {
        this.stylists = s; 
        this.stylistsLoading = false; 
        console.log(this.stylists)
      }
    );
  }

  /*
    toggles add stylist form
  */
  showAddStylist()
  {
    this.addingStylist = true;
  }

  /*
    send new stylist entered in form to stylist service method
  */
  addStylist() 
  {
    this.stylistsLoading = true;
    let stylist = {bio: this.bio, name: this.name, level: this.level};
    this.stylistService.addStylist(stylist).subscribe(value => 
    {
      this.stylists.push(value);
      this.addingStylist = false;
      this.clearFields();
      this.stylistsLoading = false;
    });
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
    Display update sytlist form for specific stylist
  */
  displayUpdateSytlist(stylist: Stylist)
  {
    this.updateSylist = true;
    this.stylistUpdateId = stylist.id;
    this.name = stylist.name;
    this.level = stylist.level;
    this.bio = stylist.bio;
  }

  /*
    send updated stylist entered in form to stylist service method
  */
  updatingStylist()
  {
    let stylist = {id: this.stylistUpdateId, bio: this.bio, name: this.name, level: this.level};
    var index = this.stylists.findIndex(x => x.id === this.stylistUpdateId);
    
    this.stylistService.updateStylist(stylist);
    this.stylists[index] = stylist;

    this.updateSylist = false;
    this.stylistUpdateId = null;
    this.clearFields();
  }

  /*
    hide stylist update form
  */
  cancelUpdatingStylist()
  {
    this.updateSylist = false;
    this.stylistUpdateId = null;
    this.clearFields();
  }

  /*
    send delete request to the specified stylist in the database using the service method
  */
  deleteStylist(stylist: Stylist)
  {
    this.stylistsLoading = true;
    this.stylistService.deleteStylist(stylist);
    var index = this.stylists.findIndex(x => x === stylist);
    this.stylists.splice(index, 1);
    this.stylistsLoading = false;
  }

  /*
    toggle delete and update buttons
  */
  toggleStylistFunctionButtons()
  {
    this.editSytlistFunctions = !this.editSytlistFunctions;
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
