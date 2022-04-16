import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {

  @Input() article: Article;
  @Input() index: number;

  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService
    ) { }

  ngOnInit() {}

  onArticleOpen(){

    if(this.platform.is("ios") || this.platform.is("android")){
      this.iab.create(this.article.url);
      return;
    }

    window.open(this.article.url);

  }

  async presentActionSheet(){

    const articleInFavorites = this.storageService.articleInFavorites(this.article);

    const normalBtns: ActionSheetButton[] = [
      {
        text: articleInFavorites ? 'Remover Favorito' : 'Favorito',
        icon: articleInFavorites ? 'heart' :'heart-outline',
        handler: () => this.onToggleFavoriteArticle()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel'
      }
    ]

    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    }

    if(this.platform.is('capacitor')){
      normalBtns.unshift(shareBtn);
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: normalBtns
    });

    

    
  
    await actionSheet.present();

  }


  onShareArticle(){

    const { title, source, url } = this.article;

    this.socialSharing.share(
      title,
      source.name,
      null,
      url
    );

  }

  onToggleFavoriteArticle(){
    
    this.storageService.saveRemoveArticle(this.article);

  }

}
