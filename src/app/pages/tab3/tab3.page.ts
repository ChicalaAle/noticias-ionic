import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  public noFavorites: boolean = true;

  constructor(private StorageService: StorageService) {}

  get articles(): Article[] {
    const arts = this.StorageService.getlocalArticles;
    if(arts.length > 0){
      this.noFavorites = false;
    }
    return arts;

  }


  ngOnInit(): void {
    this.StorageService.loadFavorites();
  }

}
