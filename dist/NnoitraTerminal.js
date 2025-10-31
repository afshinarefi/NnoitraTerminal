(()=>{function e(e){if(e=n.i?.[e]||e,!t)try{throw Error()}catch(r){var s=(""+r.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);if(!s)return i+e;t=s[0]}return new URL(i+e,t).toString()}var t,s=globalThis,i="./",r={},a={},n=s.parcelRequire166b;null==n&&((n=function(e){if(e in r)return r[e].exports;if(e in a){var t=a[e];delete a[e];var s={id:e,exports:{}};return r[e]=s,t.call(s.exports,s,s.exports),s.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,t){a[e]=t},s.parcelRequire166b=n),n.register,Object.assign(n.i??={},{cdQpk:"motd.6d76bb23.txt","6eguK":"version.a151142a.txt",h1BFt:"UbuntuMono-R.54fdcd79.ttf",h01Zq:"UbuntuMono-B.1f21d913.ttf",lAJo3:"UbuntuMono-RI.0df7809e.ttf",dYGdR:"UbuntuMono-BI.2127d1cf.ttf"});let o=new Map([["EventBus",!0],["EnvironmentService",!0],["AccountingService",!0],["CommandService",!0],["FilesystemService",!0],["HistoryService",!0],["HintService",!0],["InputService",!0],["TerminalService",!0],["ThemeService",!0],["FaviconService",!0],["LocalStorageService",!0],["AutocompleteService",!0],["TerminalPrompt",!1],["TerminalSymbol",!1],["HintBox",!1],["Terminal",!1],["CommandBlock",!1],["login",!1],["logout",!1],["ls",!1],["cat",!1],["env",!0],["history",!1],["history",!0],["cd",!0],["view",!0]]),l=()=>{},h=new Map;function c(e){if(h.has(e))return h.get(e);let t=o.get(e)||!1,s={log:t?console.log.bind(console,`[${e}]`):l,warn:t?console.warn.bind(console,`[${e}]`):l,error:t?console.error.bind(console,`[${e}]`):l};return h.set(e,s),s}let d=c("EventBus");class u{#e=new Map;#t=new Map;constructor(){d.log("Initializing...")}listen(e,t,s="anonymous"){this.#e.has(e)||this.#e.set(e,[]),this.#e.get(e).push({callback:t,name:s})}dispatch(e,t){d.log(`Dispatching event "${e}" with payload: ${JSON.stringify(t)}`),this.#e.has(e)&&Promise.resolve().then(async()=>{let s=this.#e.get(e);s&&s.forEach(s=>{d.log(`Dispatching event "${e}" to listener "${s.name}"`),Promise.resolve().then(()=>s.callback(t))})})}request(e,t={},s=6e3){let i=`${e}-${Date.now()}-${Math.random()}`;return new Promise((r,a)=>{this.#t.set(i,{resolve:r,reject:a});let n=null;s>0&&(n=setTimeout(()=>{this.#t.has(i)&&(this.#t.get(i).reject(Error(`Request timed out for event "${e} with payload: ${JSON.stringify(t)}"`)),this.#t.delete(i))},s));let o={...t,respond:t=>!!this.#t.has(i)&&(n&&clearTimeout(n),d.log(`Response received for event "${e}": ${JSON.stringify(t)}`),this.#t.get(i).resolve(t),this.#t.delete(i),!0)};this.dispatch(e,o)})}}let m="get-all-categorized-vars-request",p="variable-get-local-request",g="variable-get-system-request",y="variable-get-temp-request",v="variable-get-userspace-request",w="variable-set-local-request",f="variable-set-system-request",b="variable-set-temp-request",S="variable-set-userspace-request",C="variable-delete-local-request",x="variable-delete-userspace-request",E="load-local-variable",A="save-local-variable",I="delete-local-variable",T="variable-update-default-request",R="user-changed-broadcast",q="login-request",k="logout-request",P="password-change-request",V="add-user-request",D="is-logged-in-request",L="variable-save-remote-request",$="variable-load-remote-request",N="variable-delete-remote-request",O="history-previous-request",M="history-next-request",U="history-indexed-response",H="history-load-request",z="history-get-all-request",F="command-persist-request",B="command-execute-broadcast",_="command-execution-finished-broadcast",j="autocomplete-request",G="autocomplete-broadcast",Y="get-autocomplete-suggestions-request",W="get-aliases-request",X="set-aliases-request",K="get-command-list-request",J="get-command-meta-request",Z="input-request",Q="clear-screen-request",ee="theme-changed-broadcast",et="ui-scroll-to-bottom-request",es="set-theme-request",ei="get-valid-themes-request",er="media-request",ea="fs-change-directory-request",en="fs-get-directory-contents-request",eo="fs-get-file-contents-request",el="fs-get-public-url-request",eh="fs-resolve-path-request";class ec{#s;#i;constructor(e){if(!e)throw Error("BaseService requires an eventBus.");this.#s=e,this.#i=c(this.constructor.name),this.log.log("Initializing...")}static create(e,t={}){let s=new this(e,t);return s.#r(),s}start(){}get log(){return this.#i}dispatch(e,t={}){this.#s.dispatch(e,t)}request(e,t,s=0){return this.#s.request(e,t,s)}get eventHandlers(){return{}}#r(){for(let[e,t]of Object.entries(this.eventHandlers))this.#s.listen(e,t,this.constructor.name)}}let ed="SYSTEM",eu="USERSPACE";class em extends ec{#a=new Map;constructor(e){super(e),this.log.log("Initializing...")}get eventHandlers(){return{[m]:this.#n.bind(this),[R]:this.#o.bind(this),[p]:this.#l.bind(this),[g]:this.#h.bind(this),[y]:this.#c.bind(this),[v]:this.#d.bind(this),[w]:this.#u.bind(this),[f]:this.#m.bind(this),[b]:this.#p.bind(this),[S]:this.#g.bind(this),[C]:this.#y.bind(this),"variable-delete-system-request":this.#v.bind(this),"variable-delete-temp-request":this.#w.bind(this),[x]:this.#f.bind(this)}}start(){}async #c({key:e,respond:t}){let s=e.toUpperCase(),i=this.#a.get(s);void 0===i&&(this.log.log(`Temp variable "${s}" is undefined, requesting its default value.`),void 0!==(i=(await this.request(T,{key:s})).value)&&this.#b(s,i)),t({value:i})}async #l({key:e,respond:t}){let s=e.toUpperCase(),{value:i}=await this.request(E,{key:s,namespace:"ENV"}),r=i;void 0===r&&(this.log.log(`Local variable "${s}" is undefined, requesting its default value.`),void 0!==(r=(await this.request(T,{key:s})).value)&&this.#S(s,r)),t({value:r})}async #d({key:e,respond:t}){return this.#C({key:e,respond:t},eu)}async #h({key:e,respond:t}){return this.#C({key:e,respond:t},ed)}async #C({key:e,respond:t},s){let i,r=e.toUpperCase(),{variables:a}=await this.request($,{key:r,category:s});void 0===(i=a?a[r]:void 0)&&(this.log.log(`Remote/Userspace variable "${r}" is undefined, requesting its default value.`),void 0!==(i=(await this.request(T,{key:r})).value)&&this.#x(r,i,s)),t({value:i})}#p({key:e,value:t}){this.#b(e.toUpperCase(),t)}#u({key:e,value:t}){this.#S(e.toUpperCase(),t)}#m({key:e,value:t}){this.#x(e.toUpperCase(),t,ed)}#g({key:e,value:t}){this.#x(e.toUpperCase(),t,eu)}#w({key:e}){this.#E(e.toUpperCase())}#y({key:e}){this.#A(e.toUpperCase())}#v({key:e}){this.#I(e.toUpperCase(),ed)}#f({key:e}){this.#I(e.toUpperCase(),eu)}#T(e,t){return"number"==typeof t&&(t=String(t)),!!e&&(null===t||"string"==typeof t)||(this.log.error("Invalid key or value provided to setVariable:",{key:e,value:t,type:typeof t}),!1)}#b(e,t){this.#T(e,t)&&this.#a.set(e,t)}#S(e,t){this.#T(e,t)&&this.dispatch(A,{key:e,value:t,namespace:"ENV"})}#x(e,t,s){this.#T(e,t)&&this.dispatch(L,{key:e,value:t,category:s})}#E(e){this.#a.delete(e)}#A(e){this.dispatch(I,{key:e,namespace:"ENV"})}#I(e,t){this.dispatch(N,{key:e,category:t})}async #o(){this.#a.clear()}#n({respond:e}){(async()=>{let t={TEMP:{},LOCAL:{},SYSTEM:{},USERSPACE:{}};t.TEMP=Object.fromEntries(this.#a),t.LOCAL=(await this.request(E,{namespace:"ENV"})).value;let{variables:s}=await this.request($,{category:[ed,eu]});Object.assign(t.SYSTEM,s.SYSTEM||{}),Object.assign(t.USERSPACE,s.USERSPACE||{}),e({categorized:t})})()}}let ep=c("ApiManager");class eg{#R;constructor(e){this.#R=e}async post(e,t={},s=null){let i=new FormData;for(let[e,r]of(s&&i.append("token",s),Object.entries(t)))i.append(e,r);ep.log(`Making API call: action=${e}`);let r=await fetch(`${this.#R}?action=${e}`,{method:"POST",body:i});if(!r.ok)throw Error(`API request failed with status ${r.status}: ${r.statusText}`);let a=r.headers.get("content-type");if(!a||!a.includes("application/json"))throw Error(`Invalid response from server: Expected JSON but received ${a}. Is the server running with the --cgi flag?`);return r.json()}async get(e={}){let t=new URL(this.#R,window.location.origin);for(let[s,i]of Object.entries(e))t.searchParams.append(s,i);ep.log(`Making API call (GET): url=${t}`);let s=await fetch(t,{method:"GET"});if(!s.ok)throw Error(`API request failed with status ${s.status}: ${s.statusText}`);let i=s.headers.get("content-type");if(!i||!i.includes("application/json"))throw Error(`Invalid response from server: Expected JSON but received ${i}. Is the server running with the --cgi flag?`);return s.json()}}let ey="HOST",ev="USER",ew="HISTSIZE",ef="ALIAS",eb="TOKEN",eS="TOKEN_EXPIRY",eC="guest",ex="GUEST_STORAGE_",eE="HISTORY";class eA extends ec{#q;constructor(e,t={}){super(e),this.#q=new eg(t.apiUrl),this.log.log("Initializing...")}get eventHandlers(){return{[L]:this.#k.bind(this),[F]:this.#P.bind(this),[H]:this.#V.bind(this),[q]:this.#D.bind(this),[k]:this.#L.bind(this),[P]:this.#$.bind(this),[V]:this.#N.bind(this),[T]:this.#O.bind(this),[$]:this.#M.bind(this),[N]:this.#U.bind(this),[D]:this.#H.bind(this)}}async isLoggedIn(){let{value:e}=await this.request(p,{key:eb});return!!e}async start(){this.dispatch(R)}async login(e,t){try{this.log.log(`Attempting login for user: "${e}"`);let s=await this.#q.post("login",{username:e,password:t},null);return"success"===s.status&&(this.log.log("Login successful. Setting session variables."),this.dispatch(w,{key:eb,value:s.token}),this.dispatch(w,{key:ev,value:s.user}),this.dispatch(w,{key:eS,value:s.expires_at}),this.dispatch(R)),s}catch(e){return this.log.error("Network or parsing error during login:",e),{status:"error",message:`Error: ${e.message}`}}}async logout(){try{let{value:e}=await this.request(p,{key:eb}),t=await this.#q.post("logout",{},e);return("success"===t.status||"error"===t.status&&t.message.includes("expired"))&&(this.dispatch(C,{key:eb}),this.dispatch(w,{key:ev,value:eC}),this.dispatch(C,{key:eS}),this.dispatch(R)),t}catch(e){return this.log.error("Network or parsing error during logout:",e),{status:"error",message:`Error: ${e.message}`}}}async #D({username:e,password:t,respond:s}){s(await this.login(e,t))}async #L({respond:e}){e(await this.logout())}async #z(e,t){try{return await this.#q.post("add_user",{username:e,password:t})}catch(e){return this.log.error("Network or parsing error during user creation:",e),{status:"error",message:`Error: ${e.message}`}}}async #N({username:e,password:t,respond:s}){s(await this.#z(e,t))}async #F(e,t){let{value:s}=await this.request(p,{key:eb});if(!s)return{status:"error",message:"Not logged in."};try{return this.log.log("Attempting password change..."),this.log.log("Old password:",e),this.log.log("New password:",t),await this.#q.post("change_password",{old_password:e,new_password:t},s)}catch(e){return this.log.error("Network or parsing error during password change:",e),{status:"error",message:`Error: ${e.message}`}}}async #$({oldPassword:e,newPassword:t,respond:s}){s(await this.#F(e,t))}async #H({respond:e}){e({isLoggedIn:await this.isLoggedIn()})}#O({key:e,respond:t}){switch(e){case ev:t({value:eC});break;case eb:t({value:""})}}async #k(e){let{value:t}=await this.request(p,{key:ev});if(t===eC)this.dispatch(A,{namespace:`${ex}${e.category}`,key:e.key,value:e.value});else{let{value:t}=await this.request(p,{key:eb});this.#q.post("set_data",{category:e.category,key:e.key,value:e.value},t)}}async #U(e){let{value:t}=await this.request(p,{key:ev});if(t===eC)this.dispatch(I,{namespace:`${ex}${e.category}`,key:e.key});else{let{value:t}=await this.request(p,{key:eb});this.#q.post("delete_data",{category:e.category,key:e.key},t)}}async #P(e){let{value:t}=await this.request(p,{key:ev});if(t===eC)this.dispatch(A,{namespace:`${ex}${eE}`,key:Date.now(),value:e.command});else{let{value:t}=await this.request(p,{key:eb});this.#q.post("set_data",{category:eE,key:Date.now(),value:e.command},t)}}async #V({respond:e}){let{value:t}=await this.request(p,{key:ev});if(t===eC){let{value:t}=await this.request(E,{namespace:`${ex}${eE}`});e&&e({history:t||{}})}else try{let{value:t}=await this.request(p,{key:eb}),s=await this.#q.post("get_data",{category:eE},t);this.log.log("History data received from server:",s),e&&e({history:s.data||[]})}catch(t){this.log.error("Failed to load history from server:",t),e&&e({history:[],error:t})}}async #M({key:e,category:t,respond:s}){let{value:i}=await this.request(p,{key:ev});if(i===eC){let i={};for(let s of Array.isArray(t)?t:[t]){let r=`${ex}${s}`,{value:a}=await this.request(E,{namespace:r,key:e});void 0!==e?void 0!==a&&(i[e]=a):Array.isArray(t)?i[s]=a||{}:Object.assign(i,a||{})}s&&s({variables:i})}else try{let{value:i}=await this.request(p,{key:eb}),r=await this.#q.post("get_data",{category:t,key:e},i);this.log.log("Remote variables received from server:",r),s&&s({variables:r.data||{}})}catch(e){this.log.error("Failed to load remote variables from server:",e),s&&s({variables:{},error:e})}}}let eI="1000";class eT extends ec{#B=[];#_=0;#j=parseInt(eI,10);constructor(e){super(e),this.log.log("Initializing...")}get eventHandlers(){return{[O]:this.#G.bind(this),[M]:this.#Y.bind(this),[B]:this.#W.bind(this),[z]:this.#X.bind(this),[T]:this.#O.bind(this),[R]:this.#o.bind(this)}}#W({commandString:e}){this.addCommand(e)}#O({key:e,respond:t}){e===ew&&t({value:eI})}async #o(){let{history:e}=await this.request(H);this.loadHistory(e)}#K(e){let t=parseInt(e,10);!isNaN(t)&&t>=0?this.#j=t:(this.log.warn(`Invalid HISTSIZE value "${e}". Resetting to default: ${eI}`),this.#j=parseInt(eI,10))}async addCommand(e){let t=e.trim();if(!t||this.#B.length>0&&this.#B[0]===t)return;this.#B.unshift(t),this.dispatch(F,{command:t});let{value:s}=await this.request(g,{key:ew});this.#K(s||eI),this.#B.length>this.#j&&this.#B.pop(),this.resetCursor()}resetCursor(){this.#_=0}#G(){this.#_<this.#B.length&&this.#_++;let e={command:this.#B[this.#_-1]||"",index:this.#_};this.dispatch(U,e)}#Y(){this.#_>0&&this.#_--;let e={command:this.#B[this.#_-1]||"",index:this.#_};this.dispatch(U,e)}#X({respond:e}){e({history:this.#B.slice().reverse()})}loadHistory(e){if(e){let t=Object.keys(e).sort().map(t=>e[t]);this.#B=t.reverse(),this.resetCursor(),this.log.log(`Loaded ${this.#B.length} commands into history.`)}}clearHistory(){this.#B=[],this.resetCursor()}}c("ServiceApiManager");class eR{#s;constructor(e){this.#s=e}async prompt(e,t={}){return(await this.#s.request(Z,{prompt:e,options:t},0)).value}clearScreen(){this.#s.dispatch(Q)}scrollToBottom(){this.#s.dispatch(et)}async requestMedia(e){return(await this.#s.request(er,{src:e})).mediaElement}async login(e,t){return await this.#s.request(q,{username:e,password:t})}async logout(){return await this.#s.request(k,{})}async changePassword(e,t){return await this.#s.request(P,{oldPassword:e,newPassword:t})}async addUser(e,t){return await this.#s.request(V,{username:e,password:t})}async isLoggedIn(){return(await this.#s.request(D,{})).isLoggedIn}async isDirectory(e){return(await this.#s.request("fs-is-directory-request",{path:e})).isDirectory}async getDirectoryContents(e){let t=await this.#s.request(en,{path:e});if(t.error)throw Error(t.error.message||"Failed to get directory contents.");return t.contents}async getFileContents(e){let t=await this.#s.request(eo,{path:e});if(t.error)throw Error(t.error.message||"Failed to get file contents.");return t.contents}async getPublicUrl(e){return(await this.#s.request(el,{path:e})).url}async resolvePath(e,t=!1){let s=await this.#s.request(eh,{path:e,mustBeDir:t});if(s.error)throw s.error;return s.path}async getHistory(){return(await this.#s.request(z,{})).history}async changeDirectory(e){let t=await this.#s.request(ea,{path:e});if(t.error)throw t.error}setTempVariable(e,t){this.#s.dispatch(b,{key:e,value:t})}setLocalVariable(e,t){this.#s.dispatch(w,{key:e,value:t})}setSystemVariable(e,t){this.#s.dispatch(f,{key:e,value:t})}async getSystemVariable(e,t){return await this.#s.request(g,{key:e})}setUserspaceVariable(e,t){this.#s.dispatch(S,{key:e,value:t})}deleteUserspaceVariable(e){this.#s.dispatch(x,{key:e})}async getAllCategorizedVariables(){let{categorized:e}=await this.#s.request(m,{});return e}async getAliases(){return(await this.#s.request(W,{})).aliases}setAliases(e){this.#s.dispatch(X,{aliases:e})}async getCommandList(){return(await this.#s.request(K,{})).commands}async getCommandMeta(e,t){return(await this.#s.request(J,{commandName:e,metaKey:t})).value}async setTheme(e){return(await this.#s.request(es,{themeName:e})).theme}async getValidThemes(){return(await this.#s.request(ei,{})).themes}}function eq(e){let t=[],s=[" ","/","="],i=["'",'"'],r=["\\"],a="",n=null,o=!1,l=(e="")=>{t.push(a+e),a=""};for(let t=0;t<e.length;t++){let h=e[t];o?(a+=h,o=!1):i.includes(h)?n=n===h?null:n||h:r.includes(h)?o=!0:n?a+=h:s.includes(h)?l(h):a+=h}return l(),t}class ek{#J;#i;constructor(e){this.#J=e,this.#i=c(this.constructor.name.toLowerCase()),this.#i.log("Initializing...")}get services(){return this.#J}get log(){return this.#i}async autocompleteArgs(e){return[]}async execute(e){throw Error(`Command '${this.constructor.name}' must implement the 'execute' method.`)}}async function eP(e){let t=await fetch(e);if(!t.ok)throw Error(`HTTP error! status: ${t.status} for url: ${e}`);return t.text()}var eV={};eV=e("cdQpk");class eD extends ek{static DATA_FILE=new URL(eV);static DESCRIPTION="A short introduction.";constructor(e){super(e)}async execute(e){this.log.log("Executing...");let t=document.createElement("div");t.style.whiteSpace="pre-wrap";try{let e=await eP(eD.DATA_FILE);this.log.log(`Welcome message loaded successfully. ${e.length} characters.`),t.innerText=e}catch(e){this.log.error("Error loading welcome message:",e),t.innerText="Error: Could not load welcome message."}return t}static man(){return`NAME
       welcome - A friendly introduction to the terminal.

DESCRIPTION
       The welcome command displays a greeting message and basic instructions for using the terminal.
       It is typically the first command executed when the terminal starts.

USAGE
       welcome

       This command takes no arguments.

EXAMPLES
       $ welcome
       (Displays the welcome message.)`}}let eL=[{Type:"Image",Source:"/fs/photos/2024/2024.04.08.jpg",Id:"profile-picture"},{Type:"Text",Title:"Name",Value:"Afshin Arefi"},{Type:"Text",Title:"Description",Value:"I am a software engineer mostly interested in low level programming, data pipelines, and data manipulation. Currently I am working at Huawei as a Senior Compiler Engineer working with llvm, the kernel, and the loader."},{Type:"Text",Title:"Email",Value:"arefi.afshin@gmail.com"},{Type:"Text",Title:"LinkedIn",Value:"https://www.linkedin.com/in/arefiafshin/"}];class e$ extends ek{static DESCRIPTION="A short introduction.";#Z;constructor(e){super(e),this.#Z=e.requestMedia}static man(){return`NAME
       about - Display information about the author.

SYNOPSIS
       about

DESCRIPTION
       The about command displays a short bio, contact information, and a profile picture.`}async autocompleteArgs(e){return[]}async execute(e){this.log.log("Executing...");let t=document.createElement("div");try{for(let e of eL){let s,i=document.createElement("div");if("Text"===e.Type){s=document.createElement("p");let t=document.createElement("span");if(t.textContent=e.Title,t.classList.add("about-title"),s.appendChild(t),s.appendChild(document.createTextNode(": ")),e.Value.startsWith("http")){let t=document.createElement("a");t.href=e.Value,t.textContent=e.Value,t.target="_blank",s.appendChild(t)}else s.appendChild(document.createTextNode(e.Value))}else"Image"===e.Type&&((s=await this.#Z(e.Source)).id=e.Id);s&&(i.appendChild(s),t.appendChild(i))}}catch(e){this.log.error("Failed to fetch about information:",e),t.textContent=`Error: ${e.message}`}return t}}class eN extends ek{static DESCRIPTION="List current environment variables.";#Q;constructor(e){super(e),this.#Q=this.services.getAllCategorizedVariables}async execute(e){this.log.log("Executing...");let t=document.createElement("pre"),s=await this.#Q(),i="",r=(e,t)=>{if(0===Object.keys(t).length)return"";let s=`
# ${e} Variables
`;for(let[e,i]of Object.entries(t))"string"==typeof i&&(/\s/.test(i)||i.startsWith("{")&&i.endsWith("}"))?s+=`${e}="${i}"
`:s+=`${e}=${i}
`;return s};return i+=r("Session (In-Memory)",s.TEMP||{}),i+=r("Local (Browser Storage)",s.LOCAL),i+=r("Remote (User Account)",s.SYSTEM),t.innerText=(i+=r("User (Configurable)",s.USERSPACE)).trim(),t}static man(){return`NAME
       env - Display environment variables.

SYNOPSIS
       env [OPTION]...

DESCRIPTION
       The env command prints the current environment variables to standard output.
       Each variable is displayed on a new line in the format KEY=VALUE.

OPTIONS
       Currently, this command does not support any options.

EXAMPLES
       $ env
       (Displays all current environment variables.)`}}class eO extends ek{static DESCRIPTION="Lists available commands.";#ee;#et;constructor(e){super(e),this.#ee=this.services.getCommandList,this.#et=this.services.getCommandMeta}static man(){return`NAME
       help - Display information about available commands.

SYNOPSIS
       help

DESCRIPTION
       The help command lists all commands available in the terminal, along with a brief description for each.
       It is useful for discovering what commands can be used.

USAGE
       help

       This command takes no arguments.

EXAMPLES
       $ help
       (Displays a list of all commands and their descriptions.)`}async execute(e){this.log.log("Executing...");let t=document.createElement("div"),s=await this.#ee();if(0===s.length)return t.textContent="No commands available.",t;let i=Math.max(...s.map(e=>e.length))+4;t.style.whiteSpace="pre-wrap";let r="";for(let e of s){let t=await this.#et(e,"DESCRIPTION")||"No description available.";r+=`${e.padEnd(i)} : ${t}
`}return t.textContent=r.trim(),t}}class eM extends ek{static DESCRIPTION="Shows the manual page for a command.";#ee;#et;constructor(e){super(e),this.#ee=this.services.getCommandList,this.#et=this.services.getCommandMeta}static man(){return`NAME
       man - Display the manual page for a command.

SYNOPSIS
       man <command>

DESCRIPTION
       The man command displays the manual page for the specified command.
       If no command is specified, it will prompt for a command name.

USAGE
       man <command>

EXAMPLES
       $ man help
       (Displays the manual page for the 'help' command.)`}async autocompleteArgs(e){if(e.length>1)return[];let t=await this.#ee(),s=e[0]||"";return t.includes(s)?[]:s?t.filter(e=>e.startsWith(s)):[]}async execute(e){this.log.log("Executing with args:",e);let t=document.createElement("div");if(e.length<=1)return t.textContent="Usage: man <command>\nPlease specify a command name.",t;let s=e[1];if(!s){let e=document.createElement("p");return e.textContent="Usage: man <command>\nPlease specify a command name.",t.appendChild(e),t}let i=s.toLowerCase(),r=await this.#ee();this.log.log("Searching for command:",i);let a=r.find(e=>e.toLowerCase()===i),n=a?await this.#et(a,"man"):void 0;if(this.log.log("Exact match found:",a),!n){let e=r.filter(e=>e.toLowerCase().startsWith(i));if(this.log.log("Partial matches found:",e),1===e.length)n=await this.#et(e[0],"man"),this.log.log("Unique partial match found:",e[0]);else if(e.length>1)return t.textContent=`man: ambiguous command '${s}'; possibilities: ${e.join(" ")}`,this.log.warn("Ambiguous command:",{input:s,matches:e}),t;else return t.textContent=`No manual entry for '${s}'.`,t}return n?(this.log.log("Displaying man page."),t.style.whiteSpace="pre-wrap",t.textContent=n):(this.log.warn(`No man page function found for command: "${s}"`),t.textContent=`No manual entry for '${s}'.`),t}}class eU extends ek{static DESCRIPTION="Shows the command history.";#es;constructor(e){super(e),this.#es=this.services.getHistory}static man(){return`NAME
       history - Display the command history.

SYNOPSIS
       history

DESCRIPTION
       The history command displays a list of previously entered commands.

USAGE
       history

EXAMPLES
       $ history
       (Displays the list of commands entered in this session.)`}async execute(e){this.log.log("Executing...");let t=document.createElement("div"),s=await this.#es();if(!s||0===s.length)return t.textContent="No history available.",t;let i=String(s.length).length;return t.style.whiteSpace="pre-wrap",t.textContent=s.map((e,t)=>` ${String(s.length-t).padStart(i)}:  ${e}`).join("\n"),t}}class eH extends ek{#ei;#er;constructor(e){super(e),this.#ei=this.services.getDirectoryContents,this.#er=this.services.autocompletePath}static man(){return`NAME
       ls - List directory contents.

SYNOPSIS
       ls [directory]

DESCRIPTION
       The ls command lists files and directories in the specified location.
       If no location is given, it lists the current directory.`}async autocompleteArgs(e){let t=e.filter(e=>!e.trim().startsWith("-")).join("");try{let e=await this.#ei(t||"."),s=(e.directories||[]).map(e=>e.name+"/"),i=(e.files||[]).map(e=>e.name);return[...s,...i].sort()}catch(e){return this.log.warn(`Autocomplete failed for path "${t}":`,e),[]}}async execute(e){this.log.log("Executing with args:",e);let t=document.createElement("div"),s=e[1]||".";try{let e=await this.#ei(s);if("string"==typeof e){let s=document.createElement("pre");return s.innerText=e,t.appendChild(s),t}let i=function(e){let t=Array.isArray(e?.files)?e.files:[],s=[...(Array.isArray(e?.directories)?e.directories:[]).map(e=>({text:`${e.name}/`,style:{color:"var(--nnoitra-color-directory)"}})),...t.map(e=>{let t=null!==e.size?`(${e.size}b)`:"";return`${e.name} ${t}`})];var i=s.length>0?s:["(empty directory)"];let r=document.createElement("ul");if(r.style.listStyle="none",r.style.padding="0",r.style.margin="0",i&&0!==i.length)i.forEach(e=>{let t=document.createElement("li");"string"==typeof e?t.textContent=e:"object"==typeof e&&e.text&&(t.textContent=e.text,Object.assign(t.style,e.style)),r.appendChild(t)});else{let e=document.createElement("li");e.textContent="(empty)",r.appendChild(e)}return r}(e);t.appendChild(i)}catch(e){this.log.warn(`Cannot access path: "${s}"`,e),t.textContent=`ls: cannot access '${s}': ${e.message}`}return t}}class ez extends ek{static DESCRIPTION="Change the current working directory.";#ea;#ei;constructor(e){super(e),this.#ea=this.services.changeDirectory,this.#ei=this.services.getDirectoryContents}static man(){return`NAME
       cd - Change the current directory.

SYNOPSIS
       cd [directory]

DESCRIPTION
       The cd command changes the current working directory to the specified location.
       If no location is given, it changes to the root directory.`}async autocompleteArgs(e){let t=e.join(""),s=t.lastIndexOf("/"),i=-1===s?".":t.substring(0,s+1)||"/";try{return((await this.#ei(i)).directories||[]).map(e=>e.name+"/").sort()}catch(e){return this.log.warn(`Autocomplete failed for path "${t}":`,e),[]}}async execute(e){this.log.log("Executing with args:",e);let t=document.createElement("div"),s=e.slice(1).join("").trim()||"/";try{await this.#ea(s)}catch(e){t.textContent=`cd: ${s}: ${e.message}`}return t}}class eF extends ek{static DESCRIPTION="Print the content of a FILE";#en;#ei;constructor(e){super(e),this.#en=this.services.getFileContents,this.#ei=this.services.getDirectoryContents}static man(){return`NAME
       cat - Concatenate and print files.

SYNOPSIS
       cat [FILE]...

DESCRIPTION
       The cat command reads files sequentially, writing them to the standard output.`}async autocompleteArgs(e){let t=e.join("");try{let e=await this.#ei(t||"."),s=/\.txt$/i,i=(e.directories||[]).map(e=>e.name+"/"),r=(e.files||[]).filter(e=>s.test(e.name)).map(e=>e.name);return[...i,...r].sort()}catch(e){return this.log.warn(`Autocomplete failed for path "${t}":`,e),[]}}async execute(e){this.log.log("Executing with args:",e);let t=document.createElement("pre"),s=e.slice(1).join("").trim();if(!s)return this.log.warn("Missing file operand."),t.textContent="cat: missing file operand",t;try{t.textContent=await this.#en(s)}catch(e){this.log.error(`Failed to get file content for "${s}":`,e),t.textContent=`cat: ${s}: ${e.message}`}return t}}class eB extends ek{static DESCRIPTION="Clear the terminal output.";#eo;constructor(e){super(e),this.#eo=this.services.clearScreen}execute(e){return this.log.log("Executing clear command."),this.#eo(),document.createElement("div")}static man(){return`NAME
       clear - Clear the terminal output.

SYNOPSIS
       clear

DESCRIPTION
       The clear command erases all output in the terminal window.`}}class e_ extends ek{static DESCRIPTION="View a photo or video.";#ei;#el;#Z;constructor(e){super(e),this.#ei=this.services.getDirectoryContents,this.#el=this.services.getPublicUrl,this.#Z=this.services.requestMedia}static man(){return`NAME
       view - Display an image or video file.

SYNOPSIS
       view [file]

DESCRIPTION
       The view command displays the specified image (png, jpg, gif) or video (mp4, webm) file.
       The path can be absolute or relative to the current directory.`}async autocompleteArgs(e){let t=e.join("");try{let e=await this.#ei(t||"."),s=/\.(png|jpg|jpeg|gif|webp|mp4|webm)$/i,i=(e.directories||[]).map(e=>e.name+"/"),r=(e.files||[]).filter(e=>s.test(e.name)).map(e=>e.name);return[...i,...r].sort()}catch(e){return this.log.warn(`Autocomplete failed for path "${t}":`,e),[]}}async execute(e){this.log.log("Executing with args:",e);let t=document.createElement("div"),s=e.slice(1).join("").trim();if(!s)return this.log.warn("Missing file operand."),t.textContent="view: missing file operand",t;if(!/\.(png|jpg|jpeg|gif|webp|mp4|webm)$/i.test(s))return this.log.warn(`File is not a supported media type: "${s}"`),t.textContent=`view: ${s}: Unsupported file type.`,t;let i=await this.#el(s),r=await this.#Z(i);return t.appendChild(r),t}}class ej extends ek{static DESCRIPTION="Add a new user.";#eh;#z;constructor(e){super(e),this.#eh=this.services.prompt,this.#z=this.services.addUser}static man(){return`
NAME
       adduser - Add a new user.

SYNOPSIS
       adduser [username]

DESCRIPTION
       The adduser command creates a new user account. You will be prompted to enter and confirm a password.
       Usernames must be between 3 and 32 characters and can only contain letters, numbers, and underscores.
`}async autocompleteArgs(e){return{suggestions:[],description:"<USERNAME>"}}async execute(e){this.log.log("Executing with args:",e);let t=document.createElement("div"),s=e[1];if(!s)return t.textContent="adduser: missing username operand.",t;if(!/^[a-zA-Z0-9_]{3,32}$/.test(s))return t.textContent=`adduser: invalid username '${s}'. Usernames must be 3-32 characters and contain only letters, numbers, and underscores.`,t;try{let e=await this.#eh("Password: ",{isSecret:!0,allowHistory:!1,allowAutocomplete:!1});if(null===e)return t.textContent="adduser: Operation cancelled.",t;let i=await this.#eh("Confirm password: ",{isSecret:!0,allowHistory:!1,allowAutocomplete:!1});if(null===i)return t.textContent="adduser: Operation cancelled.",t;if(e!==i)return t.textContent="adduser: Passwords do not match. User not created.",t;t.textContent="Creating user...";let r=await this.#z(s,e);"success"===r.status?t.textContent=`User '${s}' created successfully.`:t.textContent=`adduser: ${r.message}`}catch(e){this.log.error("Error during user creation:",e),t.textContent="adduser: An unexpected error occurred."}return t}}class eG extends ek{static DESCRIPTION="Log in as a user.";#eh;#ec;constructor(e){super(e),this.#eh=this.services.prompt,this.#ec=this.services.login}static man(){return`NAME
       login - Log in to the system.

SYNOPSIS
       login [username]

DESCRIPTION
       Authenticates the user and starts a session.`}async autocompleteArgs(e){return e.length>1?[]:{suggestions:[],description:"<USERNAME>"}}static isAvailable(e){return!e.isLoggedIn}async execute(e){this.log.log("Executing with args:",e);let t=document.createElement("div"),s=e[1];if(!s)return t.textContent="Usage: login <username>",t;this.log.log("Prompting user for password.");let i=await this.#eh("Password: ",{isSecret:!0,allowHistory:!1,allowAutocomplete:!1});try{t.textContent=(await this.#ec(s,i)).message}catch(e){this.log.error("Network or parsing error during login:",e),t.textContent=`Error: ${e.message}`}return t}}class eY extends ek{static DESCRIPTION="Log out of the current session.";#ed;constructor(e){super(e),this.#ed=this.services.logout}static man(){return`NAME
       logout - Log out of the system.

SYNOPSIS
       logout

DESCRIPTION
       Ends the current user session.`}static isAvailable(e){return e.isLoggedIn}async execute(e){this.log.log("Executing...");let t=document.createElement("div");try{t.textContent=(await this.#ed()).message}catch(e){this.log.error("Network or parsing error during logout:",e),t.textContent=`Error: ${e.message}`}return t}}class eW extends ek{static DESCRIPTION="Change user password.";#eh;#F;constructor(e){super(e),this.#eh=this.services.prompt,this.#F=this.services.changePassword}static man(){return`
NAME
       passwd - change user password

SYNOPSIS
       passwd

DESCRIPTION
       The passwd command changes the password for the current user.
       You will be prompted for your old password, and then for the new password twice.
`}static isAvailable(e){return e.isLoggedIn}async execute(e){this.log.log("Executing...");let t=document.createElement("div"),s={isSecret:!0,allowHistory:!1,allowAutocomplete:!1};try{let e=await this.#eh("Old password: ",s),i=await this.#eh("New password: ",s),r=await this.#eh("Confirm new password: ",s);if(i!==r)return t.textContent="passwd: Passwords do not match. Password not changed.",t;if(!i)return t.textContent="passwd: Password cannot be empty.",t;t.textContent=(await this.#F(e,i)).message}catch(e){this.log.warn("Password change operation cancelled or failed:",e),t.textContent="passwd: Operation cancelled."}return t}}class eX extends ek{static DESCRIPTION="Define or display aliases.";#eu;#em;constructor(e){super(e),this.#eu=this.services.getAliases,this.#em=this.services.setAliases}static man(){return`NAME
       alias - Define or display command aliases.

SYNOPSIS
       alias [name[=value] ...]

DESCRIPTION
       The alias command allows you to create shortcuts for longer commands.

       - With no arguments, 'alias' prints the list of all current aliases.
       - With 'name=value', it defines an alias. The value can be a string in quotes.

EXAMPLES
       $ alias
       (Displays all aliases.)

       $ alias l="ls -l"
       (Creates an alias 'l' for 'ls -l'.)`}async execute(e){this.log.log("Executing with args:",e);let t=document.createElement("div");t.style.whiteSpace="pre-wrap";let s=await this.#eu();if(e.length<=1){if(0===Object.keys(s).length)this.log.log("No aliases found to display."),t.textContent="No aliases defined.";else{let e="";for(let[t,i]of Object.entries(s))e+=`alias ${t}='${i}'
`;t.textContent=e.trim(),this.log.log("Displaying all defined aliases.")}return t}let i=e.slice(1).join(""),r=i.indexOf("=");if(-1===r)return t.textContent="alias: usage: alias [name[=value] ...]",t;let a=i.substring(0,r).trim(),n=i.substring(r+1).trim();return(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))&&(n=n.slice(1,-1)),a?(s[a]=n,this.#em(s),this.log.log(`Created alias: ${a}='${n}'`)):(this.log.warn("Invalid alias format:",i),t.textContent="alias: invalid alias name"),t}}class eK extends ek{static DESCRIPTION="Remove an alias.";#eu;#em;constructor(e){super(e),this.#eu=this.services.getAliases,this.#em=this.services.setAliases}static man(){return`NAME
       unalias - Remove an alias.

SYNOPSIS
       unalias <alias_name>

DESCRIPTION
       The unalias command removes the specified alias from the list of defined aliases.

EXAMPLES
       $ unalias l
       (Removes the alias 'l'.)`}async autocompleteArgs(e){if(e.length>1)return[];let t=Object.keys(await this.#eu()),s=e[0]||"";return t.filter(e=>e.startsWith(s))}async execute(e){this.log.log("Executing with args:",e);let t=document.createElement("pre"),s=e[1];if(!s)return this.log.warn("No alias name provided."),t.textContent="unalias: usage: unalias <alias_name>",t;let i=await this.#eu();return s in i?(this.log.log(`Removing alias: "${s}"`),delete i[s],this.#em(i),t.textContent=`Alias '${s}' removed.`):(this.log.warn(`Alias not found: "${s}"`),t.textContent=`unalias: ${s}: not found`),t}}class eJ extends ek{static DESCRIPTION="Set or display user environment variables.";#ep;#Q;constructor(e){super(e),this.#ep=this.services.setUserspaceVariable,this.#Q=this.services.getAllCategorizedVariables}static man(){return`NAME
       export - Set or display user environment variables.

SYNOPSIS
       export [name[=value] ...]

DESCRIPTION
       The export command allows you to view and modify user-configurable environment variables.
       These variables are saved to your user profile.

       - With no arguments, 'export' prints the list of all current user variables.
       - With 'name=value', it defines a variable. The value can be a string in quotes.

EXAMPLES
       $ export
       (Displays all user-configurable variables.)

       $ export PS1="{user}$ "
       (Changes the command prompt format.)`}async autocompleteArgs(e){if(e.length>1)return[];let t=e[0]||"",s=(await this.#Q()).USERSPACE,i=Object.keys(s),r=t.split("="),a=r[0].toUpperCase();if(1===r.length){let e=i.filter(e=>e.startsWith(a));return 1===e.length?[`${e[0]}=`]:e}if(r.length>1&&s.hasOwnProperty(a)){let e=s[a];return[`${a}="${e}"`]}return[]}async execute(e){let t;this.log.log("Executing with args:",e);let s=document.createElement("pre"),i=e.slice(1).join(" "),r=await this.#Q(),a=r.USERSPACE||{};if(!i){let e="";for(let[t,s]of Object.entries(a))e+=`export ${t}="${s}"
`;return s.textContent=e.trim()||"No user variables defined.",s}let n=(t=i.match(/^([^=]+)=(.*)$/))?{name:t[1].trim(),value:t[2].trim().replace(/^['"]|['"]$/g,"")}:null;if(n){let e=n.name.toUpperCase();r.SYSTEM&&r.SYSTEM.hasOwnProperty(e)||r.LOCAL&&r.LOCAL.hasOwnProperty(e)||r.TEMP&&r.TEMP.hasOwnProperty(e)?s.textContent=`export: permission denied: \`${n.name}\` is a read-only variable.`:(this.#ep(e,n.value),this.log.log(`Set variable: ${n.name}='${n.value}'`))}else s.textContent='export: invalid format. Use name="value"',this.log.warn("Invalid export format:",i);return s}}class eZ extends ek{static DESCRIPTION="Remove a user environment variable.";#eg;#Q;constructor(e){super(e),this.#eg=this.services.deleteUserspaceVariable,this.#Q=this.services.getAllCategorizedVariables}static man(){return`NAME
       unset - Remove a user environment variable.

SYNOPSIS
       unset <variable_name>

DESCRIPTION
       The unset command removes the specified variable from the list of user-defined environment variables.
       It can only remove variables set with the 'export' command.

EXAMPLES
       $ unset MY_VAR
       (Removes the user variable 'MY_VAR'.)`}async autocompleteArgs(e){if(e.length>1)return[];let t=Object.keys((await this.#Q()).USERSPACE||{}),s=(e[0]||"").toUpperCase();return t.filter(e=>e.startsWith(s))}async execute(e){this.log.log("Executing with args:",e);let t=document.createElement("pre"),s=e[1];if(!s)return t.textContent="unset: usage: unset <variable_name>",t;let i=s.toUpperCase();return Object.keys((await this.#Q()).USERSPACE||{}).includes(i)?await this.#eg(i):t.textContent=`unset: ${s}: not found in userspace`,t}}class eQ extends ek{static DESCRIPTION="Set the terminal color theme.";#ey;#ev;#ew;constructor(e){super(e),this.#ey=this.services.setTheme,this.#ew=this.services.getSystemVariable,this.#ev=this.services.getValidThemes}static man(){return`NAME
       theme - Set the terminal color theme.

SYNOPSIS
       theme [color]

DESCRIPTION
       Changes the terminal's color scheme. The selected theme is saved to your user profile.

       Available colors: green, yellow, orange, red

EXAMPLES
       $ theme
       (Displays the current theme.)

       $ theme yellow
       (Sets the theme to yellow.)`}async autocompleteArgs(e){if(e.length>1)return[];let t=e[0]||"";return(await this.#ev()).filter(e=>e.startsWith(t))}async execute(e){let t=document.createElement("div"),s=e[1],i=await this.#ev();if(!s){let{value:e}=await this.#ew("THEME");return t.textContent=`Current theme: ${e}
Available themes: ${i.join(", ")}`,t}return i.includes(s)?(this.#ey(s),t.textContent=`Theme set to '${s}'.`,this.log.log(`Theme set to: ${s}`)):(t.textContent=`Error: Invalid theme '${s}'.
Available themes: ${i.join(", ")}`,this.log.warn(`Invalid theme name provided: ${s}`)),t}}var e0={};e0=e("6eguK");class e1 extends ek{static DATA_FILE=new URL(e0);static DESCRIPTION="Show version information.";constructor(e){super(e)}async execute(e){this.log.log("Executing...");let t=document.createElement("div");t.style.whiteSpace="pre-wrap";try{let e=await fetch(e1.DATA_FILE);if(!e.ok)throw Error(`Failed to load version information: ${e.statusText}`);t.innerText=await e.text()}catch(e){this.log.error("Error loading version information:",e),t.innerText="Error: Could not load version information."}return t}static man(){return`NAME
       version - Show version information.

DESCRIPTION
       The version command displays the application's version and build information.`}}class e2 extends ec{#ef=new Map;#eb;constructor(e){super(e),this.#eb=new eR(e),this.#eS(),this.log.log("Initializing...")}#eS(){this.register("welcome",eD,[]),this.register("about",e$,["requestMedia"]),this.register("env",eN,["getAllCategorizedVariables"]),this.register("help",eO,["getCommandList","getCommandMeta"]),this.register("man",eM,["getCommandList","getCommandMeta"]),this.register("history",eU,["getHistory"]),this.register("ls",eH,["getDirectoryContents"]),this.register("cd",ez,["changeDirectory","getDirectoryContents"]),this.register("cat",eF,["getFileContents","getDirectoryContents"]),this.register("clear",eB,["clearScreen"]),this.register("view",e_,["getDirectoryContents","getPublicUrl","requestMedia"]),this.register("adduser",ej,["prompt","addUser"]),this.register("login",eG,["prompt","login"]),this.register("logout",eY,["logout"]),this.register("passwd",eW,["prompt","changePassword"]),this.register("alias",eX,["getAliases","setAliases"]),this.register("unalias",eK,["getAliases","setAliases"]),this.register("export",eJ,["setUserspaceVariable","getAllCategorizedVariables"]),this.register("unset",eZ,["deleteUserspaceVariable","getAllCategorizedVariables"]),this.register("theme",eQ,["getValidThemes","setTheme","getSystemVariable"]),this.register("version",e1,[])}get eventHandlers(){return{[B]:this.#eC.bind(this),[W]:this.#ex.bind(this),[X]:this.#eE.bind(this),[Y]:this.#eA.bind(this),[T]:this.#O.bind(this),[K]:this.#eI.bind(this),[J]:this.#eT.bind(this)}}register(e,t,s=[]){this.#ef.set(e,{CommandClass:t,requiredServices:s})}#eC({commandString:e,outputElement:t}){this.execute(e,t)}getCommand(e){let t=this.#ef.get(e);if(t){let{CommandClass:s,requiredServices:i=[]}=t;return new s(i.reduce((t,s)=>("function"==typeof this.#eb[s]?t[s]=this.#eb[s].bind(this.#eb):this.log.warn(`Command '${e}' requested unknown function '${s}'.`),t),{}))}return null}getCommandClass(e){let t=this.#ef.get(e);return t?t.CommandClass:void 0}getCommandNames(){return Array.from(this.#ef.keys())}async #eR(){return[...new Set([...await this.getPermittedCommandNames()])].sort()}async getPermittedCommandNames(){let e=this.getCommandNames(),t=await this.#eq();return e.filter(e=>{let s=this.getCommandClass(e);return!s||"function"!=typeof s.isAvailable||s.isAvailable(t)}).sort()}async #eq(){return{isLoggedIn:await this.#eb.isLoggedIn()}}async #ek(e){let t=[...e],s=(t[0]||"").trim();if(!s)return{commandName:"",args:[]};let i=await this.#eb.getAliases();return i[s]&&(s=((t=[...eq(i[s]),...t.slice(1)])[0]||"").trim()),{commandName:s,args:t}}async execute(e,t){try{let s=e.trim();if(!s)return;let i=eq(s);if(0===i.length)return;let{commandName:r,args:a}=await this.#ek(i);if(!r)return;let n=t?t.element:null;if(this.#ef.has(r))try{let e=this.getCommand(r);this.log.log(`Executing command: "${a}"`);let t=await e.execute(a);n&&n.appendChild(t)}catch(e){n&&(n.textContent=`Error executing ${r}: ${e.message}`),this.log.error(`Error executing ${r}:`,e)}else n&&(n.textContent=`${r}: command not found`)}finally{this.dispatch(_)}}async #ex({respond:e}){try{let{value:t}=await this.request(g,{key:ef});e({aliases:JSON.parse(t||"{}")})}catch(t){this.log.error("Failed to get aliases:",t),e({aliases:{}})}}#eE({aliases:e}){this.dispatch(f,{key:ef,value:JSON.stringify(e)})}async #eI({respond:e}){e({commands:await this.getPermittedCommandNames()})}#eT({commandName:e,metaKey:t,respond:s}){let i=this.getCommandClass(e);if(i&&void 0!==i[t]){let e=i[t];"function"==typeof e?s({value:e()}):s({value:e})}else s({value:void 0})}async #eA({parts:e,respond:t}){let s=[],i="";if(e.length<=1)s=(await this.#eR()).map(e=>e+" ");else{let{commandName:t,args:r}=await this.#ek(e),a=this.getCommandClass(t);if(a&&"function"==typeof a.prototype.autocompleteArgs){let e=this.getCommand(t),a=await e.autocompleteArgs(r.slice(1));Array.isArray(a)?s=a:"object"==typeof a&&null!==a&&(s=a.suggestions||[],i=a.description||"")}}t({suggestions:s,description:i})}#O({key:e,respond:t}){e===ef&&t({value:"{}"})}}class e5 extends ec{#q;constructor(e,t={}){super(e),this.#q=new eg(t.apiUrl),this.log.log("Initializing...")}get eventHandlers(){return{[eo]:this.#eP.bind(this),[en]:this.#eV.bind(this),[ea]:this.#eD.bind(this),[eh]:this.#eL.bind(this),[el]:this.#e$.bind(this),[T]:this.#O.bind(this)}}async #eV({path:e,respond:t}){try{let s=await this.#ei(e);t({contents:s})}catch(e){t({error:e})}}async #eP({path:e,respond:t}){try{let s=await this.#en(e);t({contents:s})}catch(e){t({error:e})}}async #eD({path:e,respond:t}){try{let s=await this.#eN(e,!0);this.dispatch(b,{key:"PWD",value:s}),t({success:!0})}catch(e){t({error:e})}}async #eL({path:e,respond:t}){try{let s=await this.#eN(e,!1);t({path:s})}catch(e){t({error:e})}}async #e$({path:e,respond:t}){try{let{value:s}=await this.request(y,{key:"PWD"}),i=await this.#eO("get_public_url",{path:e,pwd:s});t({url:i.url})}catch(e){t({error:e})}}#O({key:e,respond:t}){"PWD"===e&&(this.dispatch(b,{key:e,value:"/"}),t({value:"/"}))}async #ei(e){let{value:t}=await this.request(y,{key:"PWD"});return this.#eO("ls",{path:e,pwd:t})}async #en(e){let{value:t}=await this.request(y,{key:"PWD"});return(await this.#eO("cat",{path:e,pwd:t})).content}async #eO(e,t={}){try{let s=await this.#q.get({action:e,...t});if(s.error)throw Error(s.error);return s}catch(s){throw this.log.error(`Error during API request for action "${e}" with path "${t.path}":`,s),s}}async #eN(e,t){let{value:s}=await this.request(y,{key:"PWD"});return(await this.#eO("resolve",{path:e,pwd:s,must_be_dir:t})).path}}let e3="THEME",e4="green";class e6 extends ec{static VALID_THEMES=["green","yellow","orange","red"];#eM=null;constructor(e){super(e),this.log.log("Initializing...")}setView(e){this.#eM=e,this.log.log("View connected.")}async start(){let{value:e}=await this.request(g,{key:e3}),t=e||e4;this.applyTheme(t)}get eventHandlers(){return{[es]:this.#eU.bind(this),[T]:this.#O.bind(this),[ei]:this.#eH.bind(this),[R]:this.#o.bind(this)}}#eU({themeName:e,respond:t}){t({theme:this.applyTheme(e)})}async #o(){this.log.log("User changed, re-evaluating theme.");let{value:e}=await this.request(g,{key:e3}),t=e||e4;this.applyTheme(t,!1)}#O({key:e,respond:t}){e===e3&&(this.dispatch(f,{key:e,value:e4}),t({value:e4}))}#eH({respond:e}){e({themes:this.getValidThemes()})}applyTheme(e){let t=e6.VALID_THEMES.includes(e)?e:e4;if(this.#eM){let e=`var(--nnoitra-color-${t})`;this.#eM.style.setProperty("--nnoitra-color-theme",e)}return this.dispatch(ee,{themeName:t}),this.dispatch(f,{key:e3,value:t}),this.log.log(`Applied theme: ${t}`),t}getValidThemes(){return e6.VALID_THEMES}}class e8 extends ec{#eM=null;#ez="";#eF=!1;#eB=!1;#e_=!1;#ej=!1;constructor(e){super(e),this.log.log("Initializing...")}setView(e){this.#eM=e,this.#eM.addEventListener("enter",e=>this.#eG(e.detail.value)),this.#eM.addEventListener("tab",()=>this.#eY()),this.#eM.addEventListener("arrow-up",()=>this.#eW()),this.#eM.addEventListener("arrow-down",()=>this.#eX()),this.#eM.addEventListener("swipe-right",()=>this.#eY()),this.#eM.setAttribute("disabled","")}get eventHandlers(){return{[Z]:this.#eK.bind(this),[U]:this.#eJ.bind(this),[G]:this.#eZ.bind(this)}}#eG(e){this.respond&&(this.#eQ(e),this.#ej=!1,this.#eM.clear())}#eY(){this.log.log("Tab key pressed - triggering autocomplete if allowed.",this.#e_),this.#e_&&this.#e0(this.#eM.getValue())}#eW(){this.#eB&&(this.#ej||(this.#ez=this.#eM.getValue(),this.#ej=!0),this.#eM.setAttribute("disabled",""),this.dispatch(O))}#eX(){this.log.log("ArrowDown key pressed - requesting next history if allowed."),this.#eB&&this.#ej&&(this.#eM.setAttribute("disabled",""),this.dispatch(M))}#e0(e){if(this.#e_){this.#eM.setAttribute("disabled","");let t=this.#eM.getCursorPosition(),s=e.substring(0,t),i=e.substring(t);this.log.log("Dispatching autocomplete request:",{beforeCursorText:s,afterCursorText:i}),this.dispatch(j,{beforeCursorText:s,afterCursorText:i})}}#e1(e,t={}){this.#eF=t.isSecret||!1,this.#eB=t.allowHistory||!1,this.#e_=t.allowAutocomplete||!1,this.#ez="",this.#ej=!1,this.#eM.clear(),this.#eM.removeAttribute("disabled"),this.#eM.setAttribute("placeholder",e),this.#eF?this.#eM.setAttribute("secret",""):this.#eM.removeAttribute("secret"),this.#eM.focus()}#eQ(e){this.respond({value:e}),this.#eM.setAttribute("disabled","")}#eK(e){let{prompt:t,options:s,respond:i}=e;this.#e1(t,s),this.respond=i}#eJ(e){this.#eM&&(this.#eM.removeAttribute("disabled"),void 0!==e.command&&(e.index>0?(this.#eM.setValue(e.command),this.#eM.setAttribute("icon-text",`H:${e.index}`)):(this.#eM.setValue(this.#ez),this.#ej=!1,this.#ez="",this.#eM.removeAttribute("icon-text"))))}#eZ(e){if(this.#eM)try{let{newTextBeforeCursor:t,afterCursorText:s}=e;if(void 0!==t){let e=t+s;this.#eM.setValue(e),this.#eM.setCursorPosition(t.length)}}finally{this.#eM.removeAttribute("disabled")}}}class e9 extends ec{#eM=null;#e2;constructor(e){super(e),this.log.log("Initializing...")}setView(e){this.#eM=e,this.#e2=new ResizeObserver(()=>{this.dispatch(et)}),this.#e2.observe(this.#eM)}get eventHandlers(){return{[G]:this.#e5.bind(this),[B]:this.#e3.bind(this)}}#e5(e){if(!this.#eM)return;let{options:t=[],description:s,prefixLength:i}=e;if(this.#eM.innerHTML="",s){let e=document.createElement("li");e.textContent=s,this.#eM.appendChild(e),this.#eM.setAttribute("prefix-length","0"),this.#eM.removeAttribute("hidden")}else if(t.length>1){let e=document.createDocumentFragment();t.forEach((t,s)=>{let i=document.createElement("li");i.textContent=t,e.appendChild(i)}),this.#eM.appendChild(e),this.#eM.setAttribute("prefix-length",i),this.#eM.removeAttribute("hidden")}else this.#eM.setAttribute("hidden","")}#e3(){this.#eM&&(this.#eM.setAttribute("hidden",""),this.#eM.innerHTML="")}}function e7(e){let{size:t,bgColor:s,symbolColor:i}=e,r=document.createElement("canvas");r.width=r.height=t;let a=r.getContext("2d"),n=Math.max(2,.15*t);a.roundRect(0,0,t,t,n),a.fillStyle=s,a.fill();let o=.3*t;a.beginPath(),a.arc(t/2,t/2,o,0,2*Math.PI),a.fillStyle=i,a.fill();let l=.22*t;return a.beginPath(),a.arc(.47*t,.39*t,l,0,2*Math.PI),"transparent"==s?(a.globalCompositeOperation="destination-out",a.fill(),a.globalCompositeOperation="source-over"):(a.fillStyle=s,a.fill()),r.toDataURL("image/png")}function te(e){let{size:t,bgColor:s,symbolColor:i}=e,r=document.createElement("canvas");r.width=r.height=t;let a=r.getContext("2d"),n=Math.max(2,.15*t);a.roundRect(0,0,t,t,n),a.fillStyle=s,a.fill();let o=.2*t,l=t-o,h=t-o;return a.beginPath(),a.moveTo(o,o),a.lineTo(h,o),a.lineTo(o,l),a.lineTo(h,l),a.closePath(),a.fillStyle=i,a.fill(),r.toDataURL("image/png")}function tt(e){let{size:t,bgColor:s,symbolColor:i}=e,r=document.createElement("canvas");r.width=r.height=t;let a=r.getContext("2d"),n=Math.max(2,.15*t);a.roundRect(0,0,t,t,n),a.fillStyle=s,a.fill(),a.fillStyle=i,a.strokeStyle=i,a.lineWidth=Math.max(1,.15*t);let o=.15*t;return a.beginPath(),a.arc(.35*t,.35*t,o,0,2*Math.PI),a.stroke(),a.beginPath(),a.moveTo(.45*t,.45*t),a.lineTo(.7*t,.7*t),a.lineTo(.6*t,.8*t),a.stroke(),r.toDataURL("image/png")}class ts extends ec{static #e4=[16,32,64,128,180];#eM=null;constructor(e){super(e),this.log.log("Initializing...")}setView(e){this.#eM=e,this.log.log("View connected.")}get eventHandlers(){return{[ee]:this.#e6.bind(this)}}#e6(){if(!this.#eM)return void this.log.warn("Cannot render favicon, view is not connected.");let e=getComputedStyle(this.#eM),t={bgColor:e.getPropertyValue("--nnoitra-color-theme").trim()||"green",symbolColor:e.getPropertyValue("--nnoitra-color-text-highlight").trim()||"#000"};document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']").forEach(e=>e.remove()),ts.#e4.forEach(e=>{let s=e7({...t,size:e});this.log.log(s);let i=document.createElement("link");i.rel=180===e?"apple-touch-icon":"icon",i.type="image/png",i.sizes=`${e}x${e}`,i.href=s,document.head.appendChild(i)})}}class ti extends HTMLElement{#e8;#e9={};#i;get log(){return this.#i}constructor(e){super(),this.#i=c(this.constructor.name);const t=new CSSStyleSheet;if(t.replaceSync(`
      /* Styles for encapsulation and structural fundamentals remain here.
       * The 'var()' function will look up the Custom Property
       * (which pierces the Shadow DOM) from the :root or host element.
       */

      /* Good practice to add this for consistent box model */
      * {
        box-sizing: border-box;
      }

      /* Apply colors and font-family to the host to establish inheritance
       * These custom properties should be defined at a higher level (e.g., :root or body).
       */
      :host {
        font-family: var(--nnoitra-font-family);
        color: var(--nnoitra-color-theme);
        font-size: var(--nnoitra-font-size);
      }
      `),this.#e8=this.attachShadow({mode:"closed"}),this.#e8.adoptedStyleSheets=[t],e){const t=this.#e7(e);this.#e8.appendChild(t)}this.#te()}#te(){this.#e8.querySelectorAll("[part]").forEach(e=>{let t=e.getAttribute("part");this.log.log(`Mapping ref: "${t}" to element`,e),this.#e9[t]=e})}get refs(){return this.#e9}get shadowRoot(){return this.#e8}#e7(e){let t=document.createElement("template");return t.innerHTML=e,t.content}}let tr=`
:host {
  height: 100%;
  aspect-ratio: 1;
  margin: 0;
  padding: 0;
}

[part=symbol] {
  font-family: var(--nnoitra-font-family);
  font-size: inherit;
  color: var(--nnoitra-color-text-highlight); /* VAR */
  background-color: var(--nnoitra-color-highlight); /* VAR */
  display: inline-flex;
  justify-content: center; /* Center horizontally */
  align-items: center;     /* Center vertically */
  border-radius: 3px;
  margin: 0;
  min-width: 1.5em;
  height: 100%;
  width: 100%;
  padding: 0;
  padding-left: 0.2em;
  padding-right: 0.2em;
}

[part=symbol-container] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 3px;
  padding: 0;
  height: 100%;
  width: 100%;  
}
`,ta=new CSSStyleSheet;ta.replaceSync(tr);class tn extends ti{#tt={ready:">",busy:"⧗",key:"⚷"};static #ts=[16,32,48,64];constructor(){super('<span part="symbol-container"></span>'),this.shadowRoot.adoptedStyleSheets=[...this.shadowRoot.adoptedStyleSheets,ta],this.hasAttribute("type")||this.setAttribute("type","ready")}static get observedAttributes(){return["type","value"]}attributeChangedCallback(e,t,s){this.#ti()}#ti(){let e=this.getAttribute("type")||"ready",t=this.getAttribute("value"),s=this.refs["symbol-container"];switch(s.innerHTML="",e){case"busy":this.#tr(s,te);break;case"key":this.#tr(s,tt);break;case"indexed":let i=document.createElement("span");i.part="symbol",i.textContent=`${t||""}:>`,s.appendChild(i);break;case"text":let r=document.createElement("span");r.part="symbol",r.textContent=t||"",s.appendChild(r);break;case"ready":this.#tr(s,e7)}}#tr(e,t){let s={bgColor:"transparent",symbolColor:getComputedStyle(this).getPropertyValue("--nnoitra-color-text-highlight").trim()},i=document.createElement("img");i.part="symbol",i.style.padding="0",i.style.borderRadius="3px",i.src=e7({...s,size:32}),i.srcset=tn.#ts.map(e=>`${t({...s,size:e})} ${e}w`).join(", "),e.appendChild(i)}}customElements.define("nnoitra-icon",tn);let to=`
  <div part='header'></div>
  <div part='command-container'>
  <nnoitra-icon part='icon'></nnoitra-icon>
  <span part='command'></span>
  </div>
  <div part='output'><slot></slot></div>
  `,tl=`
:host {
  --line-height: 2em;
  --line-margin: 3px;
  display: block;
  margin: 0;
  margin-top: var(--line-margin);
  padding: 0;
}

[part=header],
[part=icon],
[part=command-container],
[part=output] {
  display: none;
}

:host(.header-visible) [part=header] {
  display: block;
}

:host(.active) [part=output] {
  display: block;
  margin-top: var(--line-margin);
}

:host(.active) [part=command-container] {
  display: flex; /* Ensure it's a flex container when active */
}

:host(.active) [part=icon] {
  display: block; /* Make the icon visible when its container is active */
}

[part=icon] {
  margin: 0;
  padding: 0;
  /* Other styling for the icon is handled by the nnoitra-icon component itself */
}

[part=command-container] {
  align-items: center;
  height: var(--line-height);
  padding: 0; /* Match header's padding */
  border-radius: 3px;
  margin: 0;
  margin-top: var(--line-margin);
}

[part=command] {
  word-break: break-all;
  white-space: pre-wrap;
  align-items: center;
  flex-grow: 1; /* Take up remaining space */
  color: var(--nnoitra-color-text); /* VAR */
  margin: 0;
  padding: 0;
  margin-left: 5px; /* Space between icon and command */

}
[part=header] {
  flex-grow: 1; /* Take up remaining space */
  min-height: var(--line-height);
  line-height: var(--line-height);
  align-items: center;     /* Center vertically */
  color: var(--nnoitra-color-text-highlight); /* VAR */
  background-color: var(--nnoitra-color-highlight); /* VAR */
  padding: 0px 5px;
  border-radius: 3px;
  margin: 0px;
  margin-top: var(--line-margin);
}

[part=header]::before {
  content: '\\200b'; /* Zero-width space */
  display: inline-block; /* Ensures it contributes to the line box */
}
[part=output] {
  color: var(--nnoitra-color-output);
  margin: 0;
}

[part=output] pre {
  white-space: pre-wrap; /* Preserve whitespace but wrap long lines */
  word-wrap: break-word; /* Ensure long words without spaces also break */
  margin: 0; /* Reset default margins on pre for consistency */
}
`,th=new CSSStyleSheet;th.replaceSync(tl);class tc extends ti{constructor(){super(to),this.shadowRoot.adoptedStyleSheets=[...this.shadowRoot.adoptedStyleSheets,th]}static get observedAttributes(){return["item-id","header-text","command"]}attributeChangedCallback(e,t,s){if(t!==s)switch(e){case"item-id":this.id=`term-item-${s}`,this.hasAttribute("command")&&this.refs.icon.setAttribute("value",s);break;case"header-text":this.refs.header.textContent=s,this.classList.add("header-visible");break;case"command":this.refs.command.textContent=s;let i=this.getAttribute("item-id");i&&(this.refs.icon.setAttribute("type","indexed"),this.refs.icon.setAttribute("value",i)),this.classList.add("active")}}}customElements.define("nnoitra-term-item",tc);let td=window.location.hostname;class tu extends ec{static MOTD_FILE=new URL(eV);#eM=null;#ta=1;#tn=null;constructor(e){super(e),this.log.log("Initializing...")}setView(e){this.#eM=e}get eventHandlers(){return{[T]:this.#O.bind(this),[Q]:this.#to.bind(this),[et]:this.#tl.bind(this),[_]:this.#th.bind(this)}}async start(){if(this.#eM&&this.#eM.welcomeOutputView)try{let e=await eP(tu.MOTD_FILE);console.log(e),this.#eM.welcomeOutputView.style.whiteSpace="pre-wrap",this.#eM.welcomeOutputView.textContent=e}catch(e){this.log.error("Failed to load motd.dat:",e)}this.#th()}#O({key:e,respond:t}){switch(e){case"PS1":t({value:"[{year}-{month}-{day} {hour}:{minute}:{second}] {user}@{host}:{path}"});break;case ey:t({value:td})}}#tc(e){let t=e.PS1,s=new Date,i={user:e[ev],host:e[ey],path:e.PWD,year:s.getFullYear(),month:String(s.getMonth()+1).padStart(2,"0"),day:String(s.getDate()).padStart(2,"0"),hour:String(s.getHours()).padStart(2,"0"),minute:String(s.getMinutes()).padStart(2,"0"),second:String(s.getSeconds()).padStart(2,"0")};return t.replace(/\{(\w+)\}/g,(e,t)=>i[t]??e)}#td(e){let t=this.#ta++,s=new tc;s.setAttribute("item-id",t),s.setAttribute("header-text",e),this.#eM.appendToOutput(s),this.#tn=s}async #th(){try{let[e,t,s,i]=await Promise.all([this.request(v,{key:"PS1"}),this.request(p,{key:ev}),this.request(y,{key:ey}),this.request(y,{key:"PWD"})]),r={PS1:e.value,USER:t.value,HOST:s.value,PWD:i.value},a=this.#tc(r);this.#td(a);let{value:n}=await this.#tu();if(this.#tn){this.#tn.setAttribute("command",n);let e={element:this.#tn};this.log.log(`Executing command: "${n}"`),this.#eM.scrollToBottom(),this.dispatch(B,{commandString:n,outputElement:e})}}catch(e){this.log.error("Error in command loop:",e),this.dispatch(_)}}#to(){this.#eM&&(this.#eM.clearOutput(),this.#ta=1)}#tl(){this.#eM&&this.#eM.scrollToBottom()}#tu(){return this.request(Z,{prompt:"",options:{allowHistory:!0,allowAutocomplete:!0,isSecret:!1}},0)}}class tm extends ec{constructor(e){super(e),this.log.log("Initializing...")}get eventHandlers(){return{[j]:this.#tm.bind(this)}}async #tm({beforeCursorText:e,afterCursorText:t}){this.log.log("Autocomplete request received:",{beforeCursorText:e,afterCursorText:t});let s=eq(e),i=s.pop();s.push("");let r=[],a="",n="",o=0;try{let e=await this.request(Y,{parts:s}),{suggestions:t}=e;if(n=e.description,t&&t.length>0){let e=t.filter(e=>e.startsWith(i));a=function(e){if(!e||0===e.length)return"";let t=e[0];for(let s=1;s<e.length;s++)for(;0!==e[s].indexOf(t);)if(""===(t=t.substring(0,t.length-1)))return"";return t}(e),1===t.length&&t[0]===a?r=[]:(r=e,o=i.length)}else n&&(a=i,r=[])}catch(e){this.log.error("Error during autocomplete request:",e)}let l=a.substring(i.length);o+=l.length;let h={newTextBeforeCursor:e+l,options:r,afterCursorText:t,description:n,prefixLength:o};this.log.warn(h),this.dispatch(G,h)}}let tp=c("Media"),tg=`
  :host {
    display: block; /* Ensures the host element takes up space */
  }
  .media {
    /* Let the browser calculate width and height to preserve aspect ratio */
    width: auto;
    height: auto;
    /* On larger screens, cap the width at a reasonable size (e.g., 80rem) */
    /* Use min() to be responsive but also cap the width on large screens. */
    max-width: min(100%, 80rem);
    max-height: 80vh;
    margin: 10px 0;
    display: block; /* Helps with layout and margin */
  }
`,ty=new CSSStyleSheet;ty.replaceSync(tg);class tv extends ti{#tp;constructor(){super(),this.shadowRoot.adoptedStyleSheets=[...this.shadowRoot.adoptedStyleSheets,ty]}static get observedAttributes(){return["src"]}attributeChangedCallback(e,t,s){"src"===e&&t!==s&&(this.src=s)}set src(e){if(e){if(this.#tp&&this.#tp.remove(),/\.(png|jpg|jpeg|gif|webp)$/i.test(e))this.#tp=document.createElement("img");else{if(!/\.(mp4|webm)$/i.test(e))return void tp.error(`Unsupported file type for src: ${e}`);this.#tp=document.createElement("video"),this.#tp.controls=!0}this.#tp.classList.add("media"),this.#tp.src=e,this.shadowRoot.appendChild(this.#tp)}}get src(){return this.getAttribute("src")}}customElements.define("nnoitra-media",tv);class tw extends ec{constructor(e){super(e),this.log.log("Initializing...")}get eventHandlers(){return{[er]:this.#tg.bind(this)}}#tg({src:e,respond:t}){let s=new tv;s.src=e;let i=new ResizeObserver(e=>{e[0].contentRect.height>1&&(this.dispatch(et),i.disconnect())});i.observe(s),t({mediaElement:s})}}let tf="AREFI_LOCAL_ENV";class tb extends ec{constructor(e){super(e),this.log.log("Initializing...")}get eventHandlers(){return{[A]:this.#ty.bind(this),[E]:this.#tv.bind(this),"reset-local-variable":this.#tw.bind(this),[I]:this.#tf.bind(this)}}#tb(e){return e?`${tf}_${e.toUpperCase()}`:tf}#tS(e){let t=localStorage.getItem(this.#tb(e));if(!t)return{};try{return JSON.parse(t)}catch(e){return this.log.error("Failed to parse local environment variables from localStorage:",e),{}}}#tC(e,t){try{localStorage.setItem(this.#tb(t),JSON.stringify(e))}catch(e){this.log.error("Failed to write to localStorage:",e)}}#ty({key:e,value:t,respond:s,namespace:i}){if(void 0===e||void 0===t){this.log.warn("SAVE_LOCAL_VAR requires both a key and a value."),s&&s({success:!1});return}let r=this.#tS(i);r[e]=t,this.#tC(r,i),s&&s({success:!0})}#tv({key:e,respond:t,namespace:s}){let i=this.#tS(s),r=void 0!==e?i[e]:i;t&&t({value:r})}#tf({key:e,respond:t,namespace:s}){if(void 0===e){this.log.warn("DELETE_LOCAL_VAR requires a key."),t&&t({success:!1});return}let i=this.#tS(s);delete i[e],this.#tC(i,s),t&&t({success:!0})}#tw({namespace:e}){this.log.log(`Resetting localStorage for namespace: ${e}`),localStorage.removeItem(this.#tb(e))}}class tS{constructor(e={}){const t=new u;this.services={bus:t,environment:em.create(t),accounting:eA.create(t,{apiUrl:e.accountingApi}),history:eT.create(t),command:e2.create(t),theme:e6.create(t),input:e8.create(t),hint:e9.create(t),favicon:ts.create(t),terminal:tu.create(t),filesystem:e5.create(t,{apiUrl:e.filesystemApi}),autocomplete:tm.create(t),media:tw.create(t),localStorage:tb.create(t)}}}let tC=`
  <div part="footer">
  <nnoitra-icon part="icon"></nnoitra-icon>
  <input type="text" autocomplete="off" spellcheck="false" autocapitalize="off" part="prompt">
  </div>
  `,tx=`
[part=footer] {
  margin: 0;
  padding: 3px;
  display: flex;
  align-items: stretch; /* Change to stretch */
  border-top: 1px solid var(--nnoitra-color-highlight); /* VAR */
  background-color: var(--nnoitra-color-background); /* VAR */
  box-sizing: border-box;
  z-index: 100;
  font-size: var(--nnoitra-font-size);
  height: 2.2em;
}
[part=prompt] {
  background: none;
  border: none;
  outline: none;
  padding: 0;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin: 0;
  flex-grow: 1;
  color: var(--nnoitra-color-theme); /* VAR */
  min-width: 0; /* Prevents overflow in flex container */
  flex-grow: 1;
  font-family: var(--nnoitra-font-family);
  font-size: var(--nnoitra-font-size);
  width: 100%;
}
[part=prompt]::placeholder {
  color: var(--nnoitra-color-placeholder);
  font-family: var(--nnoitra-font-family);
  font-size: var(--nnoitra-font-size);
  opacity: 1; /* Firefox has a lower default opacity for placeholders */
  width: 100%;
}

[part=icon] {
  height: 100%;
  aspect-ratio: 1;
  margin: 0;
  padding: 0;
}
`,tE=new CSSStyleSheet;tE.replaceSync(tx),customElements.define("nnoitra-cmd",class extends ti{#eF=!1;#tx="";#tE=!0;#tA=0;#tI=0;constructor(){super(tC),this.shadowRoot.adoptedStyleSheets=[...this.shadowRoot.adoptedStyleSheets,tE],this.refs.footer.addEventListener("touchstart",this.#tT.bind(this),{passive:!0}),this.refs.footer.addEventListener("touchend",this.#tR.bind(this),{passive:!0}),this.refs.prompt.addEventListener("input",this.#tq.bind(this)),this.refs.prompt.addEventListener("keydown",this.#tk.bind(this))}static get observedAttributes(){return["disabled","secret","placeholder","icon-text"]}attributeChangedCallback(e,t,s){switch(e){case"disabled":this.#tE=!this.hasAttribute("disabled"),this.#tE&&!this.#eF?this.#tP():this.#tE||this.#tV();break;case"secret":this.#eF=this.hasAttribute("secret"),this.#eF?this.#tD():this.#tP();break;case"placeholder":this.refs.prompt.placeholder=s||"";break;case"icon-text":null!==s?(this.refs.icon&&this.refs.icon.setAttribute("type","text"),this.refs.icon&&this.refs.icon.setAttribute("value",s)):this.#eF?this.#tD():this.#tP()}}#tq(e){if(!this.#eF)return;let t=this.refs.prompt,s=this.#tx,i=t.value,r=t.selectionStart,a=s.length-(i.length-(e.data?e.data.length:0)),n=r-(e.data?e.data.length:0),o=s.slice(0,n),l=s.slice(n+a),h=o+(e.data||"")+l;this.#tx=h,requestAnimationFrame(()=>{t.value="●".repeat(this.#tx.length),t.setSelectionRange(r,r)})}#tk(e){if(!this.#tE){e.preventDefault(),e.stopPropagation();return}"Enter"===e.key?(e.preventDefault(),this.#tL("enter",{value:this.getValue()})):"Tab"===e.key?(e.preventDefault(),this.#tL("tab")):"ArrowUp"===e.key?(e.preventDefault(),this.#tL("arrow-up")):"ArrowDown"===e.key&&(e.preventDefault(),this.#tL("arrow-down"))}#tT(e){let t=e.touches[0];t&&(this.#tA=t.clientX,this.#tI=t.clientY)}#tR(e){let t=e.changedTouches[0];if(0===this.#tA||!t)return;let s=t.clientX-this.#tA,i=t.clientY-this.#tI;s>50&&50>Math.abs(i)&&this.#tL("swipe-right")}#tL(e,t={}){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:t}))}focus(){this.refs.prompt.focus()}getValue(){return this.#eF?this.#tx:this.refs.prompt.value}setValue(e){this.#eF?(this.#tx=e,this.refs.prompt.value="●".repeat(e.length)):this.refs.prompt.value=e}getCursorPosition(){return this.refs.prompt.selectionStart}setCursorPosition(e){this.refs.prompt.setSelectionRange(e,e)}clear(){this.refs.prompt.value="",this.#tx=""}#tP(){this.refs.icon&&this.refs.icon.setAttribute("type","ready")}#tV(){this.refs.icon&&this.refs.icon.setAttribute("type","busy")}#tD(){this.refs.icon&&this.refs.icon.setAttribute("type","key")}}),c("HintBox");let tA=`
  <ul part="box"></ul>
  <slot hidden></slot>
`,tI=`
:host([hidden]) {
  display: none;
}

[part=box] {
  color: var(--nnoitra-color-theme); /* VAR */
  background-color: var(--nnoitra-color-background); /* VAR */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  width: 100%;
  margin: 0;
  border-left: 3px solid var(--nnoitra-color-highlight);
  padding: 5px 0 0 10px;
}

[part=box] li {
  flex-shrink: 1;
  margin-right: 1em;
  margin-bottom: 0.5em;
  min-width: 0;
  white-space: normal;
  overflow-wrap: break-word;
  opacity: 0;
  transform: translateY(-5px);
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

[part=box] li.visible {
  opacity: 1;
  transform: translateY(0);
}

.prefix {
  color: var(--nnoitra-color-muted);
}

.suffix {
  font-weight: bold;
}
`,tT=new CSSStyleSheet;tT.replaceSync(tI),customElements.define("nnoitra-hint-box",class extends ti{constructor(){super(tA),this.shadowRoot.adoptedStyleSheets=[...this.shadowRoot.adoptedStyleSheets,tT],this.shadowRoot.querySelector("slot").addEventListener("slotchange",()=>this.#ti())}static get observedAttributes(){return["hidden","prefix-length"]}attributeChangedCallback(e,t,s){this.#ti()}#ti(){let e=this.refs.box;if(e.innerHTML="",this.hasAttribute("hidden"))return;let t=parseInt(this.getAttribute("prefix-length")||"0",10),s=this.querySelectorAll("li");if(0===s.length)return;let i=document.createDocumentFragment();s.forEach((e,s)=>{let r=e.textContent||"",a=document.createElement("li"),n=document.createElement("span"),o=document.createElement("span");n.className="prefix",n.textContent=r.substring(0,t),o.className="suffix",o.textContent=r.substring(t),a.appendChild(n),a.appendChild(o),i.appendChild(a),setTimeout(()=>a.classList.add("visible"),50*s)}),e.appendChild(i)}});let tR=c("Terminal"),tq=new URL(e("h1BFt")),tk=new URL(e("h01Zq")),tP=new URL(e("lAJo3")),tV=new URL(e("dYGdR")),tD=`
  <div part="terminal">
  <div part="welcome-output"></div>
  <div part="output"></div>
  <nnoitra-hint-box part="hint" hidden></nnoitra-hint-box>
  </div>
  <nnoitra-cmd part="prompt"></nnoitra-cmd>
  `,tL=`
:host {
  /* Default Theme & Font Variables */
  --nnoitra-color-green: #5CB338;
  --nnoitra-color-yellow: #ECE852;
  --nnoitra-color-orange: #FFC145;
  --nnoitra-color-red: #FB4141;
  --nnoitra-color-black: #000000;
  --nnoitra-color-white: #FFFFFF;
  --nnoitra-color-theme: var(--nnoitra-color-green);
  --nnoitra-color-muted: color-mix(in srgb, var(--nnoitra-color-theme), black 40%);
  --nnoitra-color-placeholder: var(--nnoitra-color-muted);
  --nnoitra-color-output: var(--nnoitra-color-white);
  --nnoitra-color-highlight: var(--nnoitra-color-theme);
  --nnoitra-color-text-highlight: var(--nnoitra-color-black);
  --nnoitra-font-family: 'Ubuntu Mono', Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace;
  --nnoitra-font-size: clamp(0.9rem, 3vw, 1.2rem);


  /* Default Layout & Appearance */
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--nnoitra-color-black);
  color: var(--nnoitra-color-theme);
  font-size: var(--nnoitra-font-size);
  font-family: var(--nnoitra-font-family);
}

/* Styles for links injected by commands like 'about' */
a {
    color: var(--nnoitra-color-theme);
    //text-decoration: none; /* Remove underline for a cleaner look */
}

/* Styles for 'about' command content */
.about-title {
    font-weight: bold;
}
`,t$=`
[part=terminal] {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  height: 100%;
  width: 100%;
}
[part=prompt] {
  flex-shrink: 0;
}

[part=terminal] [part=hint] {
  padding: 0;
  margin: 0;
  margin-top: 6px;
}

`,tN=new CSSStyleSheet;tN.replaceSync(tL+t$),customElements.define("nnoitra-terminal",class extends ti{#e2;#t$;#J;constructor(){super(tD),this.#tN(tq,{weight:"normal"}),this.#tN(tk,{weight:"bold"}),this.#tN(tP,{weight:"normal",style:"italic"}),this.#tN(tV,{weight:"bold",style:"italic"}),this.shadowRoot.adoptedStyleSheets=[...this.shadowRoot.adoptedStyleSheets,tN]}static get observedAttributes(){return["autofocus","filesystem-api","accounting-api"]}get promptView(){return this.refs.prompt}get hintView(){return this.refs.hint}get welcomeOutputView(){return this.refs["welcome-output"]}#tO(){let e=new tS({filesystemApi:this.getAttribute("filesystem-api"),accountingApi:this.getAttribute("accounting-api")});this.#J=e.services,this.#J.input.setView(this.promptView),this.#J.hint.setView(this.hintView),this.#J.terminal.setView(this),this.#J.theme.setView(this),this.#J.favicon.setView(this),this.#tM(),tR.log("Terminal bootstrapped successfully.")}#tN(e,t={}){let{weight:s="normal",style:i="normal"}=t,r=new FontFace("Ubuntu Mono",`url(${e.href})`,{weight:s,style:i,display:"swap"});r.load().then(()=>{document.fonts.add(r),this.log.log(`Font loaded: Ubuntu Mono ${s} ${i}`)}).catch(e=>{this.log.error(`Failed to load font: Ubuntu Mono ${s} ${i}`,e)})}#tM(){this.tabIndex=0,this.addEventListener("focus",this.setFocus),this.refs.terminal.addEventListener("click",this.#tU.bind(this))}connectedCallback(){this.#tO(),this.#e2=new ResizeObserver(()=>{this.scrollToBottom()}),this.#e2.observe(this.refs.terminal),this.#t$=new MutationObserver(()=>this.scrollToBottom()),this.#t$.observe(this.refs.terminal,{childList:!0,subtree:!0}),Object.values(this.#J).forEach(e=>{e&&"function"==typeof e.start&&e.start()})}disconnectedCallback(){this.#e2&&this.#e2.disconnect(),this.#t$&&this.#t$.disconnect()}attributeChangedCallback(e){"autofocus"===e&&this.hasAttribute("autofocus")&&this.setFocus()}#tU(e){e.target===this.refs.terminal&&this.setFocus()}appendToOutput(e){this.refs.output.appendChild(e)}clearOutput(){this.refs.output&&(this.refs.output.innerHTML="")}setFocus(){this.promptView.focus()}scrollToBottom(){requestAnimationFrame(()=>{this.refs.terminal.scrollTop=this.refs.terminal.scrollHeight})}})})();