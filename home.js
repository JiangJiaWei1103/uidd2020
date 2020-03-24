$(function() {   // run inner statements once the page DOM is ready (shorthand)
  /* variable definition */
  var $slideBar = $("#bar")   // sliding bar
  var $qMark = $("#q-mark")   // question mark at the middle of the sliding bar
  var $citySideBlock = $("#city-side-info")   // city side detailed page for more information
  var $mainBlock = $("main")   // movable main block 
  var $gateSideBlock = $("#gate-side-info")   // gate side detailed page for more information
  var $gateTitle = $("#gate-side-title")   // welcome title at gate side
  var $cityTitle = $("#city-side-title")   // welcome title at city side
  var $listItems = document.body.querySelectorAll(".side-list-container li a")   // all items in side list 
  var $floorIcons = document.body.querySelectorAll(".side-floor img")   // floor icons (show when corresponding item clicked)
  var $homeFooter = $("#home-footer")   // footer at home page
  var $sideFooter = $(".side-footer")   // footer at side page
  var $cityInfoBtn = $("#city-info-button")   // help button for city side
  var $gateInfoBtn = $("#gate-info-button")   // help button for gate side
  var mouseDown = false   // mouse up and down indicator
  const qMarkCenter = $qMark.position().left   // reference point of movable q-mark
  const qMarkLLimit = $slideBar.position().left   // left limit of q-mark
  const qMarkRLimit = $slideBar.position().left + $slideBar.width() - $qMark.width()   // right limit of q-mark
  const mainHide = 300   // maximum pixels that main block hides over the visible window (fixed 300px)
  const mainOriginPos = $mainBlock.position().left   // original position of main block
  
  /* function definition */
  function mainMoveDistance() {   // calculate the distance that main block should move
    let qMarkX = $qMark.position().left   // used to determine the x position of q-mark
    let qMarkMoveD = qMarkX - qMarkCenter   // calculate the distance that q-mark moves
    let proportion = 300 / (qMarkCenter - qMarkLLimit)
    let mainMoveD = -(qMarkMoveD * proportion)   
    
    return mainMoveD
  }

  /* event handlers  */ 
  // sliding bar with q-mark animation
  $qMark.draggable({
    containment: "#bar",   // limit the range that q-mark can drag 
    axis: "x",   // draggable direction 
    revert: true,   // when stopping (stop definition below), q-mark will revert back
    drag: () => {   // dragging action with page changing effect 
      let qMarkPos = $qMark.position().left   // q-mark position indicator
      let mainMoveD = mainMoveDistance()   // distance main block should move
      $mainBlock.css("transform", "translateX(" + mainMoveD + "px)")   // translate x position of main block (no jquery animate support, so use css instead)
      if(qMarkPos.toFixed(2) == qMarkRLimit.toFixed(2)) {   // q-mark touches bar's limit ( use the non-precise comparison to increase limit tolerance)
        $gateTitle.fadeIn(900, () => {
          $mainBlock.fadeOut(300, () => {
            $gateSideBlock.fadeIn(900) 
          })
          $homeFooter.fadeOut(300, () => {
            $cityInfoBtn.addClass("hidden-info-btn")
            $sideFooter.css("display", "flex").hide().slideDown(900)
          })
        }) 
      }
      else if(qMarkPos.toFixed(2) == qMarkLLimit.toFixed(2)) {
        $cityTitle.fadeIn(900, () => {
          $mainBlock.fadeOut(300, () => {
            $citySideBlock.fadeIn(900) 
          })
          $homeFooter.fadeOut(300, () => {
            $gateInfoBtn.addClass("hidden-info-btn")
            $sideFooter.css("display", "flex").hide().slideDown(900)
          })
        })
      }
    },
    stop: () => {   // let q-mark revert smoothly with animation
      $(this).mouseup(() => {   
        let lastX = mainMoveDistance()   // last x position before stopping dragging q-mark
        $({x: lastX}).animate({x: 0}, {
          duration: 500,
          step: function(val) {
            $mainBlock.css("transform", "translateX(" + `${val}` + "px)")   // let main block back to the original position
          }
        })
      })
    }
  })
 
  // item hover and click animation
  $listItems.forEach((item) => {
    item.addEventListener("mouseenter", function() {   // mouseenter, icon scales up
      this.parentElement.style.transform = "scale(1.2)"
    })
    item.addEventListener("mouseleave", function() {   // mouseleave, icon scales back to normal
      this.parentElement.style.transform = "scale(1)"
    })
    item.addEventListener("click", function() {   // click, item clicked and corresponding icon shown on floor map
      let imgUrl = $(this).css("background-image")   // image url of clicked list item 
      // get rid of some string pattern to let url matching work
      imgUrl = imgUrl.replace("url(", "").replace(")", "").replace("\"", "").replace("\"", "")
      imgUrl = imgUrl.replace("https://luffy.ee.ncku.edu.tw/~waynechuang97/HW/HW1/", "")
      imgUrl = imgUrl.replace("https://jiangjiawei1103.github.io/uidd2020/", "")
      $floorIcons.forEach((icon) => {
        if($(icon).attr("src") == imgUrl) {   // url matches, show icon on the floor map
          $(icon).fadeIn(1000)
        }
        else {
          $(icon).fadeOut(500)
        }
      })
    })
  })
});
