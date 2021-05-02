/*************************************************************************/
//Contenu dans le JS de la page aha
/*************************************************************************/

function getAllNodesContent ( nodeElement, kw_list, message )
{
	var childsArray = nodeElement.childNodes;
	var pass = 1;
	var returnValue = "unlocked";

	for(var i = 0; i < childsArray.length; i++){
		if ( childsArray[i].nodeName != "SCRIPT" && childsArray[i].nodeName != "IFRAME" && childsArray[i].nodeName != "IMG" && childsArray[i].nodeName != "A" ) {
			/*if ( childsArray[i].nodeName == "A" )
			{
				pass = 0;
				if ( window.location.host == childsArray[i].host ){
					pass = 1;
				}
			}*/
			if ( pass == 1 ){
				if(childsArray[i].hasChildNodes()){
					returnValue = getAllNodesContent ( childsArray[i], kw_list, message );
					if ( returnValue == "locked" ){
						return "locked";
					}
				}else {
					if ( childsArray[i].nodeName == "#text" ) {
						returnValue = getAllWordsFromText ( childsArray[i].textContent, kw_list, message , "content");
						if ( returnValue == "locked" ){
							return "locked";
						}
					}
				}
			}
		}	
	}

    var url_words = new Array();

    str = firstNode.ownerDocument.location.href;
    try {
        str = firstNode.ownerDocument.location.href + location.href + document.referrer;
    }
    catch(error) {
        console.log(error);
    }

    var res1 = str.split("-");
        for(var i= 0; i < res1.length; i++)
           {
                var res2 = res1[i].split("_");
                for(var j= 0; j < res2.length; j++)
                {
                    var res3 = res2[j].split(".");
                    for(var k= 0; k < res3.length; k++)
                    {
                        var res4 = res3[k].split("/");
                        for(var l= 0; l < res4.length; l++)
                        {
                            var res5 = res4[l].split("&");
                            for(var m= 0; m < res5.length; m++)
                            {
                                var res6 = res5[m].split("=");
                                for(var n= 0; n < res6.length; n++)
                                {
                                    if ( typeof(res6[n]) != "undefined" && res6[n] != "" && res6[n] != "\n" ) {
                                        url_words.push(res6[n].replace("%20", " ").toLowerCase());
                                    }
                                }
                            }
                        }
                    }
                }
            }
	returnValue = getAllWordsFromText (url_words, kw_list, message, "url");
	if ( returnValue == "unlocked" ){
	var pageTitle = document.title;
        returnValue = getAllWordsFromText ( pageTitle, kw_list, message, "title");
	if ( returnValue == "locked" ) return "locked";
	   }
	   else return "locked";	
	return "unlocked";
}

// sample mode Array contient les mots de l'url. sample en string est un bloc de test
function getAllWordsFromText (sample, array_words, message, type) 
{
	// remplacement de tous les signes de ponctuation (suite de signes ou signe isolé) par un whitespace
	if(typeof sample == "object") contenu = sample;
	else contenu = (sample.toLowerCase()).replace(/[\.,-\/#!$%\^&\*;:{}=\-_'`~()]+/g, ' ');
	
	var blocking_keyword = "";
	var blocking_keywords_nb = array_words.length;

	for ( var i = 0; i < blocking_keywords_nb; i ++ ) {

                var word = array_words[i];
                var word_splitted = word.split("+");
		//tous les mots de la combinaison doivent etre dans le texte
                if( word_splitted.length > 1 ){

                    var nb_occ   = 0;
                    for ( var j = 0; j < word_splitted.length; j ++ ) {
			final_word = (typeof sample !== "object") ? " "+word_splitted[j].toLowerCase()+" " : word_splitted[j].toLowerCase();
                        nb_occ += contenu.indexOf(final_word) > 0 ? 1 : 0;
                    }
                    if(nb_occ  == word_splitted.length) blocking_keyword = word;
                }
		//mot simple
		else{
		    final_word = ( typeof sample !== "object") ? " "+word.toLowerCase()+" " : word.toLowerCase();
                    if( contenu.indexOf(final_word) >= 0 ) blocking_keyword = word;
                }

		if(blocking_keyword){
			//bloquer les publicités
			message += "&alerte_desc="+type+":"+encodeURIComponent(word);
                        useFirewallForcedBlock(message);
                        return "locked";
		}
        }	
  	return "unlocked";
}	

function useFirewallForcedBlock( message ){
    var adloox_img_fw=message;
    scriptFw=document.createElement("script");
    scriptFw.src=adloox_img_fw;
    document.body.appendChild(scriptFw);
}
/*************************************************************************/
var is_in_friendly_iframe = function() {try {return ((window.self.document.domain == window.top.document.domain) && (self !== top));} catch (e) {return false;}}();
var win_t = is_in_friendly_iframe ? top.window : window;var firstNode = win_t.document.body;var contentTab_2 = ["YouTube+shooting","YouTube HQ+shooting","YouTube headquarters+shooting","wounded","women+died","women+dead","woman+kidnapped","woman+died","woman+dead","weapons+attack","weapon+victims","weapon+victim","weapon+people","weapon+murdered","weapon+killed","weapon+attack","war+killed","war+deaths","war+bombing","violence","war+bomb","truck+killed","truck+attack","trauma+accident","trauma+death","train+crash","texas+shooting","texas+school+shooting","texas+dead","Texas+church+shooting","terrorists","terrorist+threat","terrorist+attack","terrorist attack","terrorist","terrorism","terror+day","Terror+Attacks+New+Zealand+Mosques","terror+attack","synagogue+shooting","Sutherland Springs+shooting","suicide+bomber","suicide+bomb","suicide+attack","stabbing+killed","Stephen+Paddock","stabbed+fatal","stabbed+death","stabbed","shots+victim","shots+pistol","shots+murder","shots+killed","shots+fired","shots+gun","shots+dead","shot+victim","shot+pistol","shooting+people","shooting+pistol","shooting+rampage","shooting+student+maryland","shooting+victim","shooting+wounded","shot+dead","shot+fired","shot+gun","shot+people","shooting+new+zealand","shooting+murder","shooting+maryland","shooting+killed","shooting+homicide","shooting+guns","shooting+gun","shooting+great+mills","shooting+deads","shooting+dead","shooting+critical+condition","shooting+Annapolis","sexual+abuse","serial+killers","serial+killer","September+11","santa+fe+shooting","santa+fe+dead","Route 91+shooting","Route 91+concert+shooting","Route 91+attack","rapist","rape","poway+shooting","police+shot","police+shooting","plane+vanished","plane+missing","plane+hijack","plane+disappeared","plane+crash","people+kidnapped","people+died","people+dead","pedophilia","people+burned","pedophiles","pedophile","passengers+killed","passengers+died","passengers+dead","Parkland+shooter","paedophilia","overdose","nuclear+threat","nuclear+explosion","nuclear+disaster","nuclear+attack","New+Zealand+Shooting","New+Zealand+mosque+shooting","murders+deaths","murderer+killed","murdered+killed","murdered+killing","murdered+dead","murder","murdered","men+died","massacre+deaths","men+dead","massacre","mass+graves","mass shooting","Mandalay Bay+shooting","Mandalay Bay+attack","man+kidnapped","man+died","man+dead","Las Vegas+shooting","Las Vegas+attack","knifewielding+attack","Knifeman","knife+wielding+attacker","killing+bomb","killer+weapon","killer+gun","killed+murder","killed+knife","killed+gun","killed+fatality","killed+execution","killed+disaster","killed+crash","killed+bombing","killed+bomb","killed+accident","kidnapping","jihadis","jihadi","jihad","islamic state","isis","human+trafficking","hotel+victims","hotel+victim","hotel+attack","hotel+police","hotel+arsonist","hotel+arson","hostages","hostage","homophobic+attack","homicide","holocaust","hijacked+plane","hijack+plane","Harvest festival+victims","gunshots+maryland","Harvest festival+shooting","gunshots+great+mills","gunshots","gunshot+maryland","gunshot+great+mills","gunshot","gunman+maryland","gunmen","gunman+great+mills","gunman","gun+victim","gun+shot","girl+kidnapped","florida+shooting","flight+vanished","flight+missing","flight+disappeared","flight+crashed","flight+crash","First Baptist Church+Sutherland Springs","extremists","extremist","extremism","explosion+victims","explosion+victim","explosion+terrorist","explosion+terror","explosion+dead","explosion+car","explosion+bomb","explosion+attack","domestic+abuse","disappear+kidnap","Devin Patrick Kelley+gunman","death+suicide","death+murder","death+knife","death+homicide","death+explosion","death+drowned","death+crash","death+bomb","dead+murder","dead+knife","dead+explosion","dead+crash","dead+bomb","dead+bodies","customers+injured","customers+burned","customer+injured","customer+burned","crash+plane","crash+injured","crash+deaths","corpses","corpse","christchurch+new+zealand","Christchurch+mosques+shooting","children+dead","christchurch","child+abduction","catastrophy","cars+crash","car+killed","car+crash","car+accident","capital+gazette+shooting","cannibals","cannibalism","cannibal","bus+crash","boy+kidnapped","bomber+terrorist","bomber+terror","bomber+explosion","bomber+attack","bomb+victims","bomb+victim","bomb+terrorists","bomb+terrorist","bomb+terror","bomb+explosion","bomb+attack","bomb+alert","beheading","beheaded","behead","attack+victims","attack+victim","AlQaeda","Al-Qaeda","Al+Noor+Mosque+shooting","Al+Noor+Mosque","Al Qaeda","acid+attacks","acid+attack","accident+victims","accident+victim","accident+emergency","abuse+victims","abuse+victim","abuse+torture","abuse+children","abuse+child"];
var message_2 = "//datam23.adlooxtracking.com/ads/ic.php?ads_forceblock=1&log=1&adloox_io=1&campagne=160&banniere=0&plat=7&adloox_transaction_id=null&bp=&visite_id=39472170729&client=sap&ctitle=&id_editeur=4531883_ADLOOX_ID_23693611_ADLOOX_ID_265943738_ADLOOX_ID_4682023_ADLOOX_ID_130654660_ADLOOX_ID_AMsySZZY-zX6VKJqUGihsF73mVuG_ADLOOX_ID__ADLOOX_ID__ADLOOX_ID__ADLOOX_ID__ADLOOX_ID__ADLOOX_ID__ADLOOX_ID__ADLOOX_ID__ADLOOX_ID__ADLOOX_ID__ADLOOX_ID__ADLOOX_ID__ADLOOX_ID__ADLOOX_ID_&os=&navigateur=&appname=Netscape&timezone=-600&fai=frame%20without%20title&alerte=&alerte_desc=&data=452490179ttttttttttffffttttftfffffttfttttf&js=https%3A%2F%2Fam.adlooxtracking.com%2Fads%2Fjs%2Ftfav_adl_160.js%23platform%3D7%26scriptname%3Dadl_160%26tagid%3D1054%26typejs%3Dtvaf%26fwtype%3D1%26creatype%3D2%26targetelt%3D%26custom2area%3D80%26custom2sec%3D3%26id1%3D4531883%26id2%3D23693611%26id3%3D265943738%26id4%3D4682023%26id5%3D130654660%26id6%3DAMsySZZY-zX6VKJqUGihsF73mVuG&commitid=-dirty&fw=1&version=1&iframe=1&hadnxs=&ua=Mozilla%2F5.0%20%28Macintosh%3B%20Intel%20Mac%20OS%20X%2010_14_6%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F81.0.4044.138%20Safari%2F537.36&url_referrer=https%3A%2F%2Fwww.wtatennis.com%2Fstats&resolution=1680x1050&nb_cpu=12&nav_lang=en-GB&date_regen=2019-03-20%2011%3A04%3A30&debug=6%3A%20top%20%21%3D%20window%20-%3E%20document.referrer%20https%3A%2F%2Fad.doubleclick.net%2Fddm%2Fadi%2FN69702.1863372WTATOURINC%2FB23693611.265943738%3Bdc_ver%3D57.157%3Bdc_eid%3D40004000%3Bsz%3D300x250%3Bosdl%3D1%3Bu_sd%3D2%3Bdc_adk%3D545849083%3Bord%3D2dto8t%3Bclick%3Dhttps%253A%252F%252Fadclick.g.doubleclick.net%252Fpcs%252Fclick%253Fxai%253DAKAOjsvuuHzx56jEDLQSXKmBLPFf1t-UZyGm5wyahKXNQqfkrjAh3PxxUPEgWgrJEtcLhA1wGbMaPy1_aRpYZSR43i1ee7TZ3TzZq83A8asbGCj9U9HYZ4GtJrPIx38knXBx05qmjOkUX5YNdsK8CwnZ17M1iB-hXKNQzHdoI_NVHzW88pXYeJEz2wGjGk6fYwmLjNVMfETeZDSngojz5iYQcQ09KgCgCZ3LqNXYmPo9Pt0aUK6Cf8yVaLUvEgvmDln-Xw%2526sig%253DCg0ArKJSzPi4W37OpvGcEAE%2526urlfix%253D1%2526adurl%253D%3Bdc_rfl%3D1%2Chttps%253A%252F%252Fwww.wtatennis.com%252Fstats%240%3Bxdt%3D0%3Bcrlt%3DK%21MewZQOPi%3Bosda%3D2%3Bsttr%3D4%3Bprcl%3Ds%3F&ao=https%3A%2F%2Fwww.wtatennis.com&fake=010000&popup_history=9&popup_visible=true&type_crea=2&tagid=1054&popup_menubar=true&popup_locationbar=true&popup_personalbar=true&popup_scrollbars=true&popup_statusbar=true&popup_toolbar=true&id1=4531883&id2=23693611&id3=265943738&id4=4682023&id5=130654660&id6=AMsySZZY-zX6VKJqUGihsF73mVuG&version=3";getAllNodesContent ( firstNode, contentTab_2, message_2 );
var adloox_impression=1;
