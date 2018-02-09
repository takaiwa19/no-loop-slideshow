const Vue = require('vue/dist/vue.min');

export default function(el) {
  return new Vue({
    el: el,
    data: {
      itemWidth: null,
      index:  0,
      touchX: 0,
      moveX: 0,
      touchY: 0,
      moveY: 0,
      translateX: 0,
      afterMoveX: 0,
      startPositionX: 0,
      finishPositionX: 0,
      isDrag: false,
      isAnimate: false,
      startSlide: false,
    },

    created: function() {
      this.getItemWidth();

      window.addEventListener('resize', ()=> {
        this.getItemWidth();
      });
    },

    computed: {
      style: function() {
        if(this.isAnimate) {
          return { transform: 'translate3d(' + this.translateX + 'px, 0, 0)', transitionDuration: '0.6s' };

        } else {
          return { transform: 'translate3d(' + this.translateX + 'px, 0, 0)', transitionDuration: '0s'};
        }
      },
    },

    methods:{

      getItemWidth: function() {
        const item = document.querySelector('.p-slide__item');
        this.itemWidth = item.offsetWidth;
        this.translateX = this.index * -this.itemWidth;
        this.afterMoveX = this.translateX;
      },

      moveItems: function() {
        this.getItemWidth();
        setTimeout(()=> {
          this.transitionEnd();
        }, 600);
      },

      goToPrev: function() {
        if (this.isAnimate) return;
        if(this.index > 0 ) {
          this.index -= 1;
          this.isAnimate = true;
          this.moveItems();
        }
      },

      goToNext: function() {
        if (this.isAnimate) return;
        if(this.index < 4) {
          this.index += 1;
          this.isAnimate = true;
          this.moveItems();
        }
      },

      startDrag: function(event) {
        if(this.isAnimate) return;
        this.isDrag = true;
        if(event.touches){
          this.touchX = event.touches[0].clientX;
          this.moveX = event.touches[0].clientX;
          this.touchY = event.touches[0].clientY;
          this.moveY = event.touches[0].clientY;
        } else {
          event.preventDefault();
          this.touchX = event.clientX;
          this.moveX = event.clientX;
        }
      },

      drag: function(event) {
        if(this.isDrag) {
          if(event.touches) {
            this.moveX = event.touches[0].clientX;
            this.moveY = event.touches[0].clientY;
            this.translateX = this.afterMoveX + ( this.moveX - this.touchX );
          } else {
            event.preventDefault();
            this.moveX = event.clientX;
            this.translateX = this.afterMoveX + ( this.moveX - this.touchX );
          }

        }
      },

      finishDrag: function(event) {
        if(this.isDrag) {
          this.finishPositionX = this.moveX;
          this.isAnimate = true;
          if(this.moveX - this.touchX > 0) {
            if(this.index > 0) {
              this.index -= 1;
            }
            this.moveItems();
          } else if(this.moveX - this.touchX < 0) {
            if (this.index < 4) {
              this.index += 1;
            }
            if(this.index === 4) {
              this.translateX = this.index * -this.itemWidth + (this.itemWidth * (124 / 580));
              this.afterMoveX = this.translateX;
              setTimeout(()=> {
                this.transitionEnd();
              }, 600);
            } else {
              this.moveItems();
            }

          } else {
            this.isAnimate = false;
          }
          this.afterMoveX = this.translateX;
          this.isDrag = false;
          this.moveX = 0;
          this.touchX = 0;
        }
      },

      transitionEnd: function() {
        if(this.isAnimate) {
          this.isAnimate = false;
        }
      },
    }
  });
}
