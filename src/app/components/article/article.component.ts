import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetButton, ActionSheetController, Platform, ToastController } from '@ionic/angular';
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
    private storageService: StorageService,
    private toastController: ToastController
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
    normalBtns.unshift(shareBtn);

    

    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: normalBtns
    });

    

    
  
    await actionSheet.present();

  }


  onShareArticle(){

    const { title, source, url, description } = this.article;

    if(this.platform.is('capacitor') || this.platform.is('cordova')){

      this.socialSharing.share(
        title,
        source.name,
        null,
        url
      );

    } else {

      if (navigator.share) {
        navigator.share({
          title: title,
          text: description,
          url: url,
        })
          .then(() => console.log('Se compartió correctamente.'))
          .catch((error) => console.log('Error: ', error));
      } else {
        console.log('Funcionalidad no soportada');
      }

    }

    

  }

  async onToggleFavoriteArticle(){


    
   const action = await this.storageService.saveRemoveArticle(this.article);

   if(action == 'save'){
    this.toast("Artículo guardado en Favoritos.", 2000);
   } else {
    this.toast("Artículo eliminado de Favoritos.", 2000);
   }

  }

  async toast(message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

}
