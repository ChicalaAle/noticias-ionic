import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewsResponse, Article, ArticlesByCategoryAndPage } from '../interfaces';

import { map } from "rxjs/operators";
import { storedArticlesByCategory } from '../data/mock-news';


// const apiKey = environment.apiKey;
const apiKey = '2f103852f1d1412e9cb2dbff2ae19092';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  // Para conexion HTTP
  // private ArticlesByCategoryAndPage: ArticlesByCategoryAndPage = {}

  // Local
  private ArticlesByCategoryAndPage: ArticlesByCategoryAndPage = storedArticlesByCategory;
  

  private date:Date;
  private day:Number;
  private month:Number;
  private year:Number;

  constructor(private http: HttpClient) {
    this.date  = new Date();
    this.day   = this.date.getDate();
    this.month = this.date.getMonth() + 1;
    this.year  = this.date.getFullYear();
  }

  getTopHeadlines():Observable<Article[]> {

    

    return this.http.get<NewsResponse>(`https://newsapi.org/v2/everything?q=tesla&from=${this.year}-${this.month}-${this.day}&sortBy=publishedAt`, {
      params: { apiKey: apiKey }
    }).pipe(
      map( ({ articles }) => articles)
    );

  }

  getTopHeadlinesByCategory( category: string, loadMore: boolean = false ):Observable<Article[]> {

    // LOCAL
    return of(this.ArticlesByCategoryAndPage[category].articles);



    if( loadMore ){
      return this.getArticlesByCategory(category);
    }

    if( this.ArticlesByCategoryAndPage[category] ){
      return of(this.ArticlesByCategoryAndPage[category].articles);
    }

    return this.getArticlesByCategory(category);

  }


  private getArticlesByCategory(category: string): Observable<Article[]> {
    
    if(  Object.keys( this.ArticlesByCategoryAndPage ).includes(category) ){

    } else {
      this.ArticlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      }
    }

    const page = this.ArticlesByCategoryAndPage[category].page + 1;

    return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?category=${category}&page=${page}&sortBy=publishedAt`, {
      params: { apiKey: apiKey }
    }).pipe(
      map( ({ articles }) => {

        if( articles.length === 0 ) return this.ArticlesByCategoryAndPage[category].articles;

        this.ArticlesByCategoryAndPage[category] = {
          page: page,
          articles: [ ...this.ArticlesByCategoryAndPage[category].articles, ...articles ]
        }

        return this.ArticlesByCategoryAndPage[category].articles;
      })
    );

  }

}
