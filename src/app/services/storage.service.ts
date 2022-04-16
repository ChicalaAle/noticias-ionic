import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;  
  private _localArticles: Article[] = [];

  constructor(private storage: Storage) {
    this.init();
    this.loadFavorites();
   }

   get getlocalArticles(){
     return [...this._localArticles];
   }

   async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
      const storage = await this.storage.create();
      this._storage = storage;

  }

  async saveRemoveArticle( article: Article ){

    const exists = this._localArticles.find( localArticle => localArticle.title === article.title );

    if( exists ){

      this._localArticles = this._localArticles.filter( localArticle => localArticle.title !== article.title );

    } else {
      
      this._localArticles = [article, ...this._localArticles];

    }
    
    this._storage.set('articles', this._localArticles);

  }

  async loadFavorites(){

      const articles = await this._storage.get('articles');
      this._localArticles = articles;


  }


  articleInFavorites(article: Article){

    return !!this._localArticles.find( localArticle => localArticle.title === article.title );

  }

}
