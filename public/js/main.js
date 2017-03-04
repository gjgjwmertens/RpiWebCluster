/**
 * Created by G on 14-10-2016.
 */

$(function(){
   console.log('Document loaded');

   // Set active menu item nav bar
   $('ul.nav a[href="'+ window.location.pathname +'"]').parent().addClass('active');
});