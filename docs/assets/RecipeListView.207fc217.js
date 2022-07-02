import{r as k,u as C,o as S,w as T,a as i,c,b as e,F as p,d as m,e as f,f as g,I as b,T as P,g as R,n as A,t as h,h as B,R as E,i as V}from"./index.7f2c31f4.js";var $="/scriddish/images/logo.png";const q={name:"Featured",recipes:[]},F={name:"Asian",recipes:[]},H={name:"Western",recipes:[]},L={name:"Seafood",recipes:[]},I={name:"Filipino",recipes:[]};var d={featured:q,asian:F,western:H,seafood:L,filipino:I,"component-recipes":{name:"Component Recipes",recipes:[]}};const M={class:"recipes"},N={class:"recipes-container"},O=e("div",{class:"head"},[e("img",{src:$}),e("div",{class:"title"},[e("h1",null,"Plan your meals"),e("p",null,"Start by adding recipes to the meal plan")])],-1),Y={class:"recipes-nav"},j={class:"category-nav"},x={class:"categories-container"},z=["onClick","category"],W={class:"search-container"},G={class:"search",href:"#/search"},J={class:"recipes-body"},K={class:"recipes-container"},Q=["id"],U={class:"category-group-name"},X={class:"category-recipes"},Z=e("div",{class:"authors-remark"},[e("p",null,"Thank you for taking the time to check out my stuff! That's all the recipes I got for now, but I will keep an adding more as I go.")],-1),te={name:"RecipeListView",props:{mealPlan:Array,recipes:Object},emits:["add-to-meal-plan","select-recipe"],setup(r){r.recipes.forEach(o=>{let t=o.category;!t in d||d[t].recipes.includes(o.id)||d[t].recipes.push(o.id)});const u=k("featured"),v=C();S(()=>{const o=document.querySelectorAll(".category-group");window.addEventListener("scroll",t);function t(){let a=window.pageYOffset;o.forEach(s=>{const l=s.offsetHeight,n=s.offsetTop-50,w=s.getAttribute("id");a>n-200&&a<=n+l-200&&(u.value=w)})}});function y(o){const a=document.getElementById(o).offsetTop,s=document.querySelector(".categories-container").clientHeight;window.scroll({top:a-s,behavior:"smooth"})}function _(o){const t=document.querySelector(".category-nav"),s=document.querySelector(`[category="${o}"]`).offsetLeft;t.scroll({left:s-72,behavior:"smooth"})}return T(u,(o,t)=>{_(o)}),(o,t)=>(i(),c("div",M,[e("div",N,[O,e("div",Y,[e("div",j,[e("ul",x,[(i(!0),c(p,null,m(f(d),(a,s)=>(i(),c("li",{key:s,onClick:l=>y(s),class:A([{active:u.value==s},"category-pill"]),category:s},h(a.name),11,z))),128))])]),e("div",W,[e("a",G,[g(b)])])]),e("div",J,[e("ul",K,[(i(!0),c(p,null,m(f(d),(a,s)=>(i(),c("li",{key:s,id:s,class:"category-group"},[e("h3",U,h(a.name),1),e("ul",X,[(i(!0),c(p,null,m(a.recipes,l=>(i(),B(E,{key:l,"meal-plan":r.mealPlan,recipe:r.recipes.find(n=>n.id==l),onAddToMealPlan:t[0]||(t[0]=n=>o.$emit("add-to-meal-plan",n)),onViewRecipe:t[1]||(t[1]=n=>o.$emit("select-recipe",n))},null,8,["meal-plan","recipe"]))),128))])],8,Q))),128))])])]),g(P,{name:"fade-up"},{default:R(()=>[r.mealPlan.length>0?(i(),c("button",{key:0,class:"view-meal-plan-cta",onClick:t[2]||(t[2]=a=>f(v).push("/mealplan"))},"View Meal Plan ("+h(r.mealPlan.length)+")",1)):V("",!0)]),_:1}),Z]))}};export{te as default};