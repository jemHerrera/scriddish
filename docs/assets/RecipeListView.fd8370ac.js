import{_ as C,o as c,c as r,a as e,t as d,w as b,b as _,I as S,d as T,r as P,u as A,e as E,f as I,F as g,g as v,h as y,i as k,j as R,T as q,k as B,n as V,l as H}from"./index.53ec29d8.js";var L="/scriddish/images/logo.png";const M=["id"],j={class:"recipe-card-container"},F=["src"],N={class:"details"},O={class:"title"},Y={class:"description-container"},x={class:"description"},z={class:"card-footer"},Q={class:"time"},W={name:"RecipeCard",props:{recipe:Object,mealPlan:Array},emits:["view-recipe","add-to-meal-plan"],setup(s,{emit:w}){const p=s;return(h,l)=>(c(),r("a",{class:"recipe-card",id:s.recipe.id,onClick:l[1]||(l[1]=f=>h.$emit("view-recipe",p.recipe)),href:"#/recipe"},[e("div",j,[e("img",{src:"/scriddish//images/"+s.recipe.image},null,8,F),e("div",N,[e("h4",O,d(s.recipe.title),1),e("div",Y,[e("p",x,d(s.recipe.description),1)]),e("div",z,[e("p",Q,d(s.recipe.time),1),e("button",{onClick:l[0]||(l[0]=b(f=>h.$emit("add-to-meal-plan",s.recipe.id),["prevent"]))},[s.mealPlan.includes(s.recipe.id)?(c(),_(T,{key:1,class:"check"})):(c(),_(S,{key:0,class:"plus"}))])])])])],8,M))}};var G=C(W,[["__scopeId","data-v-39526b4a"]]);const J={name:"Featured",recipes:[]},K={name:"Asian",recipes:[]},U={name:"Western",recipes:[]},X={name:"Seafood",recipes:[]};var m={featured:J,"quick-and-easy":{name:"Quick and Easy",recipes:[]},asian:K,western:U,seafood:X,"component-recipes":{name:"Component Recipes",recipes:[]}};const Z={class:"recipes"},D={class:"recipes-container"},ee=e("div",{class:"head"},[e("img",{src:L}),e("div",{class:"title"},[e("h1",null,"Plan your meals"),e("p",null,"Start by adding recipes to the meal plan")])],-1),te={class:"recipes-nav"},se={class:"category-nav"},oe={class:"categories-container"},ae=["onClick","category"],ie={class:"search-container"},ce={class:"search",href:"#/search"},ne={class:"recipes-body"},re={class:"recipes-container"},le=["id"],de={class:"category-group-name"},pe={class:"category-recipes"},ue=e("div",{class:"authors-remark"},[e("p",null,"Thank you for taking the time to check out my stuff! That's all the recipes I got for now, but I will keep an adding more as I go.")],-1),he={name:"RecipeListView",props:{mealPlan:Array,recipes:Object},emits:["add-to-meal-plan","select-recipe"],setup(s){s.recipes.forEach(a=>{let t=a.category;!t in m||m[t].recipes.includes(a.id)||m[t].recipes.push(a.id)});const p=P("featured"),h=A();E(()=>{const a=document.querySelectorAll(".category-group");window.addEventListener("scroll",t);function t(){let i=window.pageYOffset;a.forEach(o=>{const u=o.offsetHeight,n=o.offsetTop-50,$=o.getAttribute("id");i>n-200&&i<=n+u-200&&(p.value=$)})}});function l(a){const i=document.getElementById(a).offsetTop,o=document.querySelector(".categories-container").clientHeight;window.scroll({top:i-o,behavior:"smooth"})}function f(a){const t=document.querySelector(".category-nav"),o=document.querySelector(`[category="${a}"]`).offsetLeft;t.scroll({left:o-72,behavior:"smooth"})}return I(p,(a,t)=>{f(a)}),(a,t)=>(c(),r("div",Z,[e("div",D,[ee,e("div",te,[e("div",se,[e("ul",oe,[(c(!0),r(g,null,v(y(m),(i,o)=>(c(),r("li",{key:o,onClick:u=>l(o),class:V([{active:p.value==o},"category-pill"]),category:o},d(i.name),11,ae))),128))])]),e("div",ie,[e("a",ce,[k(R)])])]),e("div",ne,[e("ul",re,[(c(!0),r(g,null,v(y(m),(i,o)=>(c(),r("li",{key:o,id:o,class:"category-group"},[e("h3",de,d(i.name),1),e("ul",pe,[(c(!0),r(g,null,v(i.recipes,u=>(c(),_(G,{key:u,"meal-plan":s.mealPlan,recipe:s.recipes.find(n=>n.id==u),onAddToMealPlan:t[0]||(t[0]=n=>a.$emit("add-to-meal-plan",n)),onViewRecipe:t[1]||(t[1]=n=>a.$emit("select-recipe",n))},null,8,["meal-plan","recipe"]))),128))])],8,le))),128))])])]),k(q,{name:"fade-up"},{default:B(()=>[s.mealPlan.length>0?(c(),r("button",{key:0,class:"view-meal-plan-cta",onClick:t[2]||(t[2]=i=>y(h).push("/mealplan"))},"View Meal Plan ("+d(s.mealPlan.length)+")",1)):H("",!0)]),_:1}),ue]))}};export{he as default};