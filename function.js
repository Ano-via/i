const mySecret = process.env.MY_SECRET;
console.log("My Secret:", mySecret);

var twofarequest = document.getElementById("twofarequest");
function HOTP(K, C) {
    var key = sjcl.codec.base32.toBits(K);
    // Count is 64 bits long.  Note that JavaScript bitwise operations make
    // the MSB effectively 0 in this case.
    var count = [((C & 0xffffffff00000000) >> 32), C & 0xffffffff];
    var otplength = 6;
    var hmacsha1 = new sjcl.misc.hmac(key, sjcl.hash.sha1);
    var code = hmacsha1.encrypt(count);
    var offset = sjcl.bitArray.extract(code, 152, 8) & 0x0f;
    var startBits = offset * 8;
    var endBits = startBits + 4 * 8;
    var slice = sjcl.bitArray.bitSlice(code, startBits, endBits);
    var dbc1 = slice[0];
    var dbc2 = dbc1 & 0x7fffffff;
    var otp = dbc2 % Math.pow(10, otplength);
    var result = otp.toString();
    while (result.length < otplength) {
        result = '0' + result;
    }
    return result;
}
function gettfa() {
    var secret = document.getElementById('twofarequest').value;
    if (secret.length > 0) {
        var ctime = Math.floor((new Date() - 0) / 30000);
        var otp = HOTP(secret, ctime);
        document.getElementById("twofaresult").value = otp;
    }
}
function refresh() {
    var ptext = document.getElementById("pastetext").value;
    var ptextresult = document.getElementById("dividedtext").value;
    if (ptext.length > 0 && ptextresult.length == 0) {
        dividetext();
    }
    var secret = document.getElementById('twofarequest').value;
    if (secret.length > 0) {
        var ifTfa = document.getElementById('twofaresult').value;
        if (ifTfa.length == 0) {
            gettfa();
            copytfa();
        }
        var refreshtime = 30 - Math.floor(((new Date() - 0) % 30000) / 1000);
        document.getElementById("refreshtime").value = "还剩" + refreshtime + "秒";
        if (refreshtime == 30) {
            gettfa();
            document.getElementById("copytfa").innerHTML = "复制验证码";
            var obj = document.getElementById('copytfa');
            obj.style.backgroundColor = "#f2f2f2";
            obj.style.color = "#000000";
        } else if (refreshtime <= 3) {
            var obj = document.getElementById('copytfa');
            obj.style.backgroundColor = "#ffeae6";
            obj.style.color = "#991a00";
        }
    }
    var countstr = document.getElementById("linksstr").value;
    if (countstr.length > 0) {
        countTextOcc();
    }
}

function normal8() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 8;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("password").value = password;
}
function complex16() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 16;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("password").value = password;
}
function normal16() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 16;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("password").value = password;
}
function copyPassword() {
    var copyText = document.getElementById("password");
    copyText.select();
    copyText.setSelectionRange(0, 999);
    document.execCommand("copy");
}
function copytfa() {
    var ifTfa = document.getElementById("twofaresult").value;
    if (ifTfa.length > 0) {
        var copyTfaresult = document.getElementById("twofaresult");
        copyTfaresult.select();
        copyTfaresult.setSelectionRange(0, 999);
        document.execCommand("copy");
        document.getElementById("copytfa").innerHTML = "√ 已复制验证码";
        var obj = document.getElementById('copytfa');
        obj.style.backgroundColor = "#daf2c2";
        obj.style.color = "#397300";
    } else {
        document.getElementById("copytfa").innerHTML = "没有验证码";
    }
}
function dividetext() {
    var ptext = document.getElementById("pastetext").value;
    ptext = ptext.replace(/\|\|\|/g, "\n");
    ptext = ptext.replace(/\|\|/g, "\n");
    ptext = ptext.replace(/\|/g, "\n");
    ptext = ptext.replace(/---/g, "\n");
    ptext = ptext.replace(/--/g, "\n");
    ptext = ptext.replace(/\t/g, "\n");
    ptext = ptext.replace(/\u0020/g, "");
    document.getElementById("dividedtext").value = ptext;
    document.getElementById("metalink").setAttribute("href", "https://mbasic.facebook.com?email=" + ptext.substring(0, ptext.indexOf("\n")) + "&pass=" + ptext.substring(ptext.indexOf("\n") + 1, ptext.indexOf("\n", ptext.indexOf("\n") + 1)))
    var twofact = /[A-Z0-9]{32}/g.exec(ptext);
    document.getElementById("twofarequest").value = twofact;
    var timestamp1 = Date.parse(new Date());
    var tc = Math.floor(timestamp1 / 30000);
    gettfa();
    copytfa();
}

function openlinks() {
    var linksstr = document.getElementById("linksstr").value;
    linklist = linksstr.split("\n");
    for (i = 0; i < linklist.length; i++) {
        var s;
        if (!linklist[i].includes("http")) {
            s = "http://" + linklist[i];
        } else {
            s = linklist[i];
        }
        window.open(s);
    }
}


function svttrack() {
    var linksstr = document.getElementById("linksstr").value;
    linksstr = "https://t.17track.net/zh-cn?v=2#nums=" + linksstr;
    var len = linksstr.split("\n").length;
    for (var i = 1; i <= len; i++) {
        if (i % 40 == 0) {
            linksstr = linksstr.replace("\n", "Enter2Replacehttps://t.17track.net/zh-cn?v=2#nums=");
        } else {
            linksstr = linksstr.replace("\n", ",");
        }
    }
    linksstr = linksstr.replace(/,,/g, ",");
    linksstr = linksstr.replace(/Enter2Replace/g, "\n");
    if (linksstr.charAt(linksstr.length - 1) == ",") {
        linksstr = linksstr.substring(0, linksstr.length - 1);
    }
    if (linksstr.charAt(linksstr.length - 1) == "=") {
        linksstr = linksstr.substring(0, linksstr.length - 38);
    }
    linklist = linksstr.split("\n");
    for (i = 0; i < linklist.length; i++) {
        s = linklist[i];
        window.open(s);
    }
}

function soetrack() {
    var linksstr = document.getElementById("linksstr").value;
    linksstr = "https://www.track718.us/zh-CN/detail?nums=" + linksstr;
    var len = linksstr.split("\n").length;
    for (var i = 1; i <= len; i++) {
        if (i % 40 == 0) {
            linksstr = linksstr.replace("\n", "Enter2Replacehttps://www.track718.us/zh-CN/detail?nums=");
        } else {
            linksstr = linksstr.replace("\n", ",");
        }
    }
    linksstr = linksstr.replace(/,,/g, ",");
    linksstr = linksstr.replace(/Enter2Replace/g, "\n");
    if (linksstr.charAt(linksstr.length - 1) == ",") {
        linksstr = linksstr.substring(0, linksstr.length - 1);
    }
    if (linksstr.charAt(linksstr.length - 1) == "=") {
        linksstr = linksstr.substring(0, linksstr.length - 43);
    }
    linklist = linksstr.split("\n");
    for (i = 0; i < linklist.length; i++) {
        s = linklist[i];
        window.open(s);
    }
}

function delparentheses() {
    var linksstr = document.getElementById("linksstr").value;
    var result = linksstr.replace(/ *\([^)]*\)/g, "");
    result = result.replace(/\n/g, ",");
    while (result.includes(',,')) {
        result = result.replace(/,,/g, ",");
    }
    document.getElementById("linksstr").value = result;
    var copyText = document.getElementById("linksstr");
    copyText.select();
    copyText.setSelectionRange(0, 999);
    document.execCommand("copy");
    document.getElementById("delparentheses").innerHTML = "√ 已复制";
    var obj = document.getElementById('delparentheses');
    obj.style.backgroundColor = "#daf2c2";
    obj.style.color = "#397300";
    setTimeout(function () {
        obj.innerHTML = "去括号 + 复制";
        obj.style.backgroundColor = "#f2f2f2";
        obj.style.color = "#000000";
    }, 3000);
}

function space2enter() {
    var linksstr = document.getElementById("linksstr").value;
    var result = linksstr.replace(/ *\([^)]*\)/g, "");
    result = result.replace(/\s+/g, "\n");
    document.getElementById("linksstr").value = result;
    var copyText = document.getElementById("linksstr");
    copyText.select();
    copyText.setSelectionRange(0, 9999);
    document.execCommand("copy");
    document.getElementById("space2enter").innerHTML = "√ 已复制";
    var obj = document.getElementById('space2enter');
    obj.style.backgroundColor = "#daf2c2";
    obj.style.color = "#397300";
    setTimeout(function () {
        obj.innerHTML = "空格 → 换行";
        obj.style.backgroundColor = "#f2f2f2";
        obj.style.color = "#000000";
    }, 3000);
}

function calculateUPCChecksum(digits) {
    var sum = 0;
    var parity = digits.length % 2;
    for (var i = 0; i < digits.length; i++) {
        var digit = parseInt(digits.charAt(i));
        if (i % 2 === parity) {
            sum += digit * 3;
        } else {
            sum += digit;
        }
    }
    var checksum = (10 - (sum % 10)) % 10;
    return checksum.toString();
}

function generateUPC() {
    var linksstrText = document.getElementById("linksstr").value;
    var lines = linksstrText.split('\n');
    var result = "";
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var digits = line.replace(/\D/g, '');
        digits = digits.padEnd(11, '0');
        var checksum = calculateUPCChecksum(digits);
        var upc = digits + checksum;
        result += upc + '\n';
    }
    document.getElementById("linksstr").value = result;
    var copyText = document.getElementById("linksstr");
    copyText.select();
    copyText.setSelectionRange(0, 999);
    document.execCommand("copy");
    document.getElementById("bulkupc").innerHTML = "√ 已复制";
    var obj = document.getElementById('bulkupc');
    obj.style.backgroundColor = "#daf2c2";
    obj.style.color = "#397300";
    setTimeout(function () {
        obj.innerHTML = '<img height="50%" src="https://img.icons8.com/pulsar-color/48/barcode.png" alt="upc"/>&nbsp;批量UPC';
        obj.style.backgroundColor = "#f2f2f2";
        obj.style.color = "#000000";
    }, 3000);
}
function countTextOcc() {
    var str1 = document.getElementById("linksstr").value;
    // Count the number of lines
    const linesCount = str1.split(/\r\n|\r|\n/).length;
    const linesLength = str1.length;
    // Count the number of commas
    const commasCount = (str1.match(/(%2C|,)/g) || []).length + 1;

    console.log("Number of lines:", linesCount);
    console.log("Number of commas:", commasCount);
    document.getElementById("countLinesNCommas").innerText = "行数：" + linesCount + " | 分词/商品数：" + commasCount + " | 长度：" + linesLength;
}
function copyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
}
function copyAndRedirect() {
    const code = "554e0e8654804bedad765a63330a1e75";
    copyTextToClipboard(code);
    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("popup");
    const popupText = document.getElementById("popupText");
    overlay.style.display = "block";
    popupText.textContent = "已复制邀请码，3秒后跳转到 Greasyfork";
    popup.style.display = "block";


    let countdown = 3;
    const countdownInterval = setInterval(function () {
        countdown -= 1;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            popup.style.display = "none";
            overlay.style.display = "none";
            window.open("https://greasyfork.org/zh-CN/scripts/418942-%E4%B8%87%E8%83%BD%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5-%E5%8D%87%E7%BA%A7%E7%89%88");
        } else {
            popupText.textContent = `已复制邀请码，${countdown}秒后跳转到 Greasyfork`;
        }
    }, 1000);
}
function metaCheck() {
    window.open('https://accountscenter.facebook.com/personal_info/contact_points/', '_blank');
    window.open('https://account.live.com/proofs/manage/additional', '_blank');
    window.open('https://accountscenter.facebook.com/password_and_security/login_activity', '_blank');
    window.open('https://accountscenter.facebook.com/password_and_security/login_alerts', '_blank');
    window.open('https://business.facebook.com/business-support-home/?landing_page=account_overview', '_blank');
    window.open('https://business.facebook.com/settings/info', '_blank');
}
function getMaleName() {
    // 定义一个字符串列表
    var items = ["Tyler","Tylor","Tyrell","Tyron","Tyrone","Tyrrell","Tyson","Ulric","Ulysses","Upton","Val","Valentine","Van","Vance","Vaughan","Vaughn","Vere","Vergil","Vern","Vernon","Vic","Victor","Vin","Vinal","Vince","Vincent","Vinnie","Vinny","Virgil","Vivian","Vyvyan","Wade","Waldo","Walker","Wallace","Wallis","Wally","Walt","Walter","Walton","Ward","Wardell","Warner","Warren","Warrick","Warwick","Washington","Wat","Watson","Waverly","Wayland","Waylon","Wayne","Webster","Weldon","Wells","Wendell","Wes","Wesley","Westley","Weston","Whitaker","Whitney","Wil","Wilbur","Wilburn","Wilder","Wiley","Wilf","Wilford","Wilfred","Wilfrid","Wilkie","Will","Willard","William","Willie","Willis","Willoughby","Willy","Wilmer","Wilson","Wilt","Wilton","Windsor","Winfield","Winfred","Winslow","Winston","Winthrop","Winton","Wisdom","Wolf","Wolfe","Woodie","Woodrow","Woody","Wright","Wyatt","Wynne","Wystan","Xander","Xavier","Xavior","Xzavier","Yale","Yancy","Yorick","York","Zac","Zach","Zachariah","Zachary","Zachery","Zack","Zackary","Zackery","Zaiden","Zak","Zander","Zane","Zavier","Zayden","Zayne","Zeb","Zechariah","Zed","Zeke","Zeph","Reese","Reg","Regan","Reggie","Reginald","Reid","Reign","Reilly","Remington","Remy","Rene","Reuben","Rex","Reynard","Reynold","Rhett","Rhys","Rian","Rich","Richard","Richie","Rick","Rickey","Ricki","Rickie","Ricky","Ridge","Ridley","Rigby","Riley","Riordan","Ripley","Ritchie","River","Rob","Robbie","Robby","Robert","Robin","Rocky","Rod","Roddy","Roderick","Rodge","Rodger","Rodney","Rodolph","Roger","Roland","Rolf","Rolland","Rollie","Rollo","Rolo","Rolph","Roly","Roman","Romilly","Ron","Ronald","Ronan","Ronin","Ronnie","Ronny","Roosevelt","Rorie","Rory","Roscoe","Ross","Roswell","Rowan","Rowen","Rowland","Rowley","Roy","Royal","Royale","Royce","Roydon","Royle","Royston","Rube","Rudolph","Rudy","Rudyard","Rufus","Rupert","Russ","Russel","Russell","Rusty","Ry","Ryan","Ryder","Ryker","Rylan","Ryland","Rylee","Ryley","Rylie","Sacheverell","Sage","Saint","Sal","Salem","Sam","Sammie","Sammy","Sampson","Samson","Samuel","Sandford","Sandy","Sanford","Santana","Satchel","Sawyer","Saxon","Schuyler","Scot","Scott","Scottie","Scotty","Scout","Sean","Sebastian","Sefton","Selby","Selwyn","Sequoia","Seth","Seven","Sevyn","Seward","Seymour","Shad","Shae","Shane","Shannon","Shanon","Shaun","Shaw","Shawn","Shaye","Shayne","Sheard","Shel","Shelby","Sheldon","Shelley","Shelly","Shelton","Shepherd","Sheridan","Sherman","Sherwood","Shirley","Shon","Sid","Sidney","Sigmund","Silas","Silver","Silvester","Simon","Sincere","Sinclair","Sinjin","Sky","Skylar","Skyler","Slade","Sloan","Sly","Smith","Solomon","Sonnie","Sonny","Soren","Sparrow","Spencer","Spike","Stace","Stacey","Stacy","Stafford","Stan","Stanford","Stanley","Ste","Steph","Stephen","Sterling","Stetson","Steve","Steven","Stevie","Stew","Stewart","Stirling","St","Stone","Storm","Stu","Stuart","Sullivan","Sully","Sunday","Sunny","Sutton","Syd","Sydney","Sylas","Sylvan","Sylvanus","Sylvester","Tad","Talbot","Talon","Tanner","Tate","Tatton","Tatum","Tayler","Taylor","Ted","Teddie","Teddy","Tel","Temple","Tennyson","Terance","Terell","Terence","Terrance","Terrell","Terrence","Terry","Terry","Tevin","Tex","Thad","Thaddeus","Thane","Thatcher","Theo","Theobald","Theodore","Thom","Thomas","Thorburn","Thorley","Thornton","Thurstan","Tibby","Tiger","Tim","Timmy","Timothy","Titus","Tobias","Tobin","Toby","Tod","Todd","Tolly","Tom","Tommie","Tommy","Tony","Topher","Torin","Tory","Trace","Tracey","Tracy","Trafford","Tranter","Travers","Travis","Trent","Trenton","Trev","Trevelyan","Trevor","Trey","Tripp","Tristan","Tristen","Tristin","Triston","Tristram","Troy","Trueman","Truman","Tucker","Turner","Ty","Tye","Tylar","Louie","Louis","Lovel","Lovell","Lowell","Loyd","Lucas","Lucian","Lucius","Lucky","Luke","Luther","Lyall","Lyle","Lyndon","Lynn","Lynton","Lynwood","Lyric","Mac","Macaulay","Macauley","Mack","Mackenzie","Maddox","Madison","Maitland","Major","Malachi","Malakai","Malcolm","Malcom","Malone","Manley","Manny","Mansel","Marcus","Marion","Mark","Marley","Marlin","Marlon","Marlowe","Marlyn","Marmaduke","Marshal","Marshall","Martie","Martin","Marty","Marvin","Marvyn","Mason","Masterman","Mat","Mathew","Matt","Matthew","Mattie","Matty","Maurice","Maurie","Maverick","Max","Maxie","Maximilian","Maximillian","Maxton","Maxwell","Maynard","Maynerd","Mayson","McKenzie","McKinley","Meade","Mel","Melville","Melvin","Melvyn","Memphis","Meredith","Merit","Meriwether","Merle","Merlin","Merlyn","Merrick","Merrill","Merritt","Merton","Merv","Mervin","Mervyn","Messiah","Micah","Michael","Micheal","Mick","Mickey","Micky","Mike","Mikey","Milburn","Miles","Milford","Millard","Miller","Milo","Milton","Mitch","Mitchell","Mo","Moe","Monday","Monroe","Montague","Montana","Monte","Montgomery","Monty","Morgan","Morley","Morris","Mort","Mortimer","Morton","Morty","Moses","Moss","Munro","Munroe","Murphy","Murray","Myles","Myron","Napier","Napoleon","Nash","Nat","Nate","Nathan","Nathaniel","Navy","Neal","Ned","Neely","Neil","Nelson","Nevada","Nevil","Neville","Newt","Newton","Nic","Nicholas","Nick","Nickolas","Nicky","Nigel","Nigellus","Nik","Nikolas","Niles","Nixon","Noah","Noble","Noel","Nolan","Norbert","Norm","Norman","Norris","Norton","Norwood","Nowell","Oakley","Ocean","Odell","Odin","Ogden","Oli","Oliver","Ollie","Olly","Omar","Onyx","Ora","Oral","Ormond","Ormonde","Orrell","Orson","Orval","Orville","Osbert","Osborn","Osborne","Osbourne","Oscar","Osmond","Ossie","Oswald","Oswin","Otis","Otto","Owen","Oz","Ozzie","Ozzy","Pace","Pacey","Paden","Page","Paget","Palmer","Pancras","Parker","Parris","Parry","Pat","Patrick","Patsy","Patton","Paul","Paulie","Paxton","Payton","Pearce","Peers","Pepper","Perce","Percival","Percy","Peregrine","Perry","Pete","Peter","Peyton","Phil","Philander","Philip","Phillip","Phoenix","Pierce","Piers","Pip","Placid","Porter","Praise","Presley","Preston","Price","Prince","Princeton","Promise","Prosper","Purdie","Quentin","Quin","Quincey","Quincy","Quinlan","Quinn","Quinten","Quintin","Quinton","Radcliff","Radclyffe","Raeburn","Rafe","Rafferty","Rain","Raine","Raleigh","Ralf","Ralph","Ralphie","Ramsey","Randal","Randall","Randell","Randolf","Randolph","Randy","Ranulph","Raphael","Rastus","Raven","Ray","Raymond","Raymund","Raynard","Rayner","Read","Reagan","Rearden","Red","Redd","Reece","Reed","Jaxon","Jaxson","Jaxton","Jaxtyn","Jaxx","Jaxxon","Jay","Jayce","Jaycee","Jayceon","Jaycob","Jayden","Jaydon","Jaye","Jayme","Jaymes","Jayson","Jeb","Jed","Jeff","Jefferson","Jeffery","Jeffrey","Jeffry","Jem","Jemmy","Jensen","Jenson","Jep","Jepson","Jeptha","Jerald","Jere","Jeremiah","Jeremy","Jericho","Jerold","Jerome","Jerrard","Jerred","Jerrod","Jerrold","Jerry","Jervis","Jess","Jesse","Jessie","Jessy","Jett","Jewel","Jewell","Jez","Jezza","Jim","Jimi","Jimmie","Jimmy","Jo","Joby","Jocelyn","Jody","Joe","Joel","Joey","John","Johnathan","Johnathon","Johnie","Johnnie","Johnny","John","Johnson","Jojo","Jolyon","Jon","Jonah","Jonathan","Jonathon","Jones","Jonny","Jonty","Jools","Jordan","Jordin","Jordon","Joseph","Josey","Josh","Joshua","Josiah","Joss","Joyce","Judd","Jude","Jules","Julian","Julius","July","Julyan","Junior","Justice","Justin","Justy","Kade","Kaden","Kaeden","Kai","Kaiden","Kairo","Kaison","Kaleb","Kal-El","Kam","Kamden","Kameron","Kamryn","Kane","Kaolin","Karl","Karson","Karsyn","Karter","Kasen","Kasey","Kash","Kashton","Kason","Kayce","Kayden","Kaylan","Kaylen","Kaysen","Kayson","Kean","Keane","Keaton","Keefe","Keegan","Kegan","Keiran","Keith","Kelan","Kelcey","Kellan","Kellen","Kelley","Kelly","Kelsey","Kelvin","Kemp","Ken","Kendal","Kendall","Kendrick","Kenelm","Kenith","Kennard","Kennedy","Kenneth","Kennith","Kenny","Kenrick","Kent","Kenton","Kenyon","Kenzie","Kermit","Kerry","Kester","Kev","Kevan","Kevin","Kevyn","Kian","Kiaran","Kiefer","Kieran","Kieron","Kim","Kimball","King","Kingsley","Kingston","Kip","Kipling","Kirby","Kirk","Kit","Klay","Knox","Knute","Koby","Koda","Kodey","Kody","Kohen","Kolby","Kole","Kolton","Konnor","Korbin","Korey","Kory","Kris","Kristopher","Kurt","Kurtis","Kylan","Kyle","Kyler","Kynaston","Kyro","Kyson","Lacey","Lachlan","Lacy","Laird","Lake","Lamar","Lambert","Lamont","Lance","Landen","Landon","Landyn","Lane","Lanford","Langdon","Langston","Lanny","Larrie","Larry","Lauren","Laurence","Laurie","Lavern","Laverne","Lawrence","Lawrie","Lawson","Layne","Layton","Laz","Lee","Lefty","Legacy","Legend","Leigh","Leighton","Leith","Leland","Lemoine","Len","Lenard","Lennie","Lennon","Lennox","Lenny","Lenox","Leo","Leon","Leonard","Leopold","Leroi","Leroy","Les","Lesley","Leslie","Lester","Levi","Lew","Lewin","Lewis","Lex","Leyton","Liam","Lincoln","Linden","Lindon","Lindsay","Lindsey","Lindy","Linford","Link","Linton","Linwood","Lionel","Lloyd","Lockie","Logan","Lon","London","Lonnie","Lonny","Loren","Lorin","Lorn","Lorne","Lorrin","Lou","Emmet","Emmett","Emmitt","Emory","Ennis","Eric","Erick","Erik","Erle","Ern","Ernest","Ernie","Errol","Erskine","Esme","Esmé","Esmond","Esmund","Ethan","Ethelbert","Ethelred","Eugene","Eustace","Evan","Evelyn","Ever","Everard","Everest","Everett","Everette","Everitt","Ewart","Ezekiel","Ezra","Fabian","Farley","Faron","Farrell","Favour","Felix","Fenton","Ferdie","Ferdinand","Ferdy","Finlay","Finley","Finn","Finnegan","Finnley","Fisher","Fitz","Fitzroy","Flanagan","Fletcher","Flick","Flint","Florence","Floyd","Flynn","Ford","Forest","Forrest","Fortune","Foster","Foster","Fox","Fran","Francis","Frank","Frankie","Franklin","Franklyn","Franny","Fraser","Frazier","Fred","Freddie","Freddy","Frederic","Frederick","Fredric","Fredrick","Freeman","Friday","Fulk","Fulke","Fulton","Gabe","Gabriel","Gael","Gage","Gale","Galen","Gallagher","Gareth","Garey","Garfield","Garland","Garnet","Garnett","Garret","Garrett","Garrick","Garry","Garth","Gary","Gavin","Gayelord","Gayle","Gaylord","Gaz","Geffrey","Gene","Geoff","Geoffrey","Geordie","George","Georgie","Gerald","Gerard","Gerrard","Gerry","Gervase","Gib","Gibson","Gideon","Giffard","Gift","Gil","Gilbert","Giles","Gilroy","Gladwin","Gladwyn","Glanville","Glen","Glenn","Goddard","Godfrey","Goodwin","Gord","Gorden","Gordie","Gordon","Gordy","Gore","Grady","Graeme","Graham","Grahame","Grant","Granville","Gray","Graysen","Grayson","Greer","Greg","Gregg","Gregory","Grenville","Gresham","Grey","Greyson","Grier","Griffin","Grosvenor","Grover","Gunner","Gus","Guy","Gyles","Hadley","Hadyn","Hal","Hale","Hall","Hallam","Hamilton","Hammond","Hamnet","Hank","Happy","Harding","Hardy","Harlan","Harland","Harley","Harlow","Harmon","Harold","Harper","Harris","Harrison","Harry","Hartley","Harve","Harvey","Harvie","Haven","Hayden","Haydn","Hayes","Haywood","Haze","Headley","Heath","Hector","Hedley","Henderson","Hendrix","Henry","Herb","Herbert","Herbie","Herman","Hervey","Hewie","Hilary","Hildred","Hiram","Holden","Hollis","Homer","Honor","Horace","Horatio","Houston","Howard","Howie","Hoyt","Hubert","Hudson","Huey","Hugh","Hughie","Hugo","Humbert","Humphrey","Humphry","Hunter","Huxley","Hyram","Hyrum","Ian","Iggy","Ike","Indiana","Indigo","Ingram","Inigo","Innocent","Ira","Irvin","Irvine","Irving","Irwin","Isaac","Isador","Isadore","Isaiah","Isiah","Isidore","Israel","Issac","Issy","Ivan","Ivor","Izaiah","Izzy","Jace","Jacey","Jack","Jackie","Jackson","Jacob","Jade","Jaden","Jadyn","Jae","Jagger","Jai","Jaiden","Jake","James","Jameson","Jamey","Jamie","Jamison","Jared","Jaren","Jarod","Jaron","Jarred","Jarrett","Jarrod","Jarvis","Jase","Jason","Jasper","Jax","Cedar","Cedric","Celestine","Chace","Chad","Chadwick","Chance","Chandler","Channing","Charles","Charley","Charlie","Charlton","Chas","Chase","Chauncey","Chaz","Cherokee","Chesley","Chester","Chet","Chile","Chip","Chris","Christian","Christie","Christmas","Christopher","Christy","Chuck","Chuckie","Chucky","Clair","Clancy","Clarence","Clark","Claud","Claude","Clay","Clayton","Clem","Clement","Cleo","Cletis","Cletus","Cleve","Cleveland","Cliff","Clifford","Clifton","Clint","Clinton","Clive","Clyde","Coby","Codie","Cody","Cohen","Colbert","Colby","Cole","Coleman","Colin","Colin","Collin","Collins","Collyn","Colson","Colt","Colten","Colter","Colton","Connell","Conner","Connie","Connor","Conor","Conrad","Constant","Conway","Cooper","Corbin","Cordell","Corey","Cornelius","Cornell","Cortney","Corwin","Cory","Cosmo","Coty","Courtney","Coy","Craig","Crawford","Cree","Creighton","Crew","Crispian","Crispin","Crofton","Cullen","Curran","Curt","Curtis","Cuthbert","Cy","Cyan","Cyril","Cyrus","Dacre","Dakota","Dale","Daley","Dallas","Dalton","Daly","Damian","Damion","Damon","Dan","Dana","Dane","Daniel","Dannie","Danny","Darby","D'Arcy","Darcy","Darden","Darell","Daren","Darian","Dariel","Darien","Darin","Darion","Darius","Darnell","Darrel","Darrell","Darren","Darrin","Darryl","Darwin","Daryl","Dash","Dashiell","Dave","Davey","David","Davie","Davin","Davis","Davy","Dawson","Dax","Daxton","Dayton","Deacon","Dean","Declan","Dederick","Dee","Deemer","Deforest","Deforrest","Delano","Delbert","Dell","Delmar","Delroy","Den","Dene","Denholm","Denis","Dennis","Denny","Denton","Denver","Denzel","Denzil","Deon","Derby","Derek","Derick","Derren","Derrick","Derryl","Deryck","Des","Desi","Desmond","Devan","Deven","Devereux","Devin","Devon","Devyn","Dewayne","Dewey","Dex","Dexter","Dezi","Dick","Digby","Diggory","Dillan","Dillon","Dion","Dior","Dirk","Dixon","Dolph","Dom","Domenic","Dominic","Dominick","Don","Donald","Donnie","Donny","Donovan","Doran","Dorian","Doug","Douglas","Douglass","Doyle","Drake","Dre","Drew","Driscoll","Driskoll","Drogo","Drummond","Duane","Dudley","Duff","Duke","Duncan","Dunstan","Durward","Dustin","Dusty","Dutch","Dwain","Dwayne","Dwight","Dylan","Dyson","Earl","Earle","Earnest","Easton","Eben","Ebenezer","Ed","Eddie","Eddy","Edgar","Edison","Edmund","Edric","Edward","Edwin","Edwyn","Egbert","Egypt","Eithan","Eldon","Eldred","Eli","Elias","Elihu","Elijah","Eliot","Eliott","Ellery","Ellington","Elliot","Elliott","Ellis","Elmer","Elmo","Elroy","Elsdon","Elton","Elvin","Elvis","Elwin","Elwood","Elwyn","Ely","Emerson","Emery","Emil","Emile","Emmanuel","Emmerson","Aaren","Aaron","Abe","Abel","Abner","Abraham","Abram","Ace","Adair","Adam","Addison","Aden","Adler","Adolph","Adrian","Aidan","Aiden","Al","Alan","Alban","Albert","Albie","Albin","Alden","Aldous","Alec","Alex","Alexander","Alexis","Alf","Alfie","Alfred","Algar","Alger","Algernon","Alijah","Allan","Allen","Allison","Allyn","Alonzo","Aloysius","Alpha","Alphonso","Alphonzo","Alton","Alva","Alvin","Ambrose","Amery","Amias","Amos","Amyas","Anderson","Andie","Andre","Andrew","Andy","Angel","Angus","Ansel","Anselm","Anson","Anthony","Anton","Antony","Archer","Archibald","Archie","Arden","Aric","Ariel","Arin","Arlen","Arlie","Arlo","Armani","Arn","Arnie","Arnold","Arron","Art","Arthur","Artie","Arvel","Ash","Asher","Ashley","Ashton","Ashtyn","Aster","Aston","Astor","Athelstan","Aubrey","Audie","Audley","August","Augustine","Austen","Austin","Auston","Austyn","Averill","Avery","Axel","Axl","Aydan","Ayden","Aylmer","Azure","Babe","Bailey","Baker","Baldric","Baldwin","Balfour","Banks","Barclay","Barnabas","Barnaby","Barney","Barret","Barrett","Barrie","Barry","Bart","Bartholomew","Basil","Baxter","Bayley","Baylor","Baz","Bazza","Bear","Beau","Beauden","Beaumont","Beauregard","Beck","Beckett","Beckham","Bellamy","Ben","Benedict","Benj","Benjamin","Benji","Benjy","Bennett","Bennie","Benny","Benson","Bentley","Benton","Bernard","Bernie","Berny","Berry","Bert","Bertie","Bertram","Bertrand","Bevan","Beverly","Bevis","Biff","Bill","Billie","Billy","Bishop","Blaine","Blair","Blake","Blaze","Blessing","Blue","Blythe","Bob","Bobbie","Bobby","Bodhi","Bodie","Boniface","Booker","Boone","Boston","Bowen","Bowie","Boyce","Boyd","Brad","Braden","Bradford","Bradley","Brady","Braeden","Braiden","Braidy","Braith","Bram","Brand","Branden","Brandon","Brandt","Brannon","Branson","Brant","Brantley","Braxton","Brayden","Braylen","Braylon","Brendan","Brenden","Brendon","Brennan","Brent","Brenton","Bret","Brett","Brian","Briar","Brice","Bridger","Briggs","Brigham","Brion","Briscoe","Britton","Brock","Brodie","Brody","Bronson","Bronte","Brook","Brooklyn","Brooks","Bruce","Bryan","Bryant","Bryce","Brycen","Bryn","Bryon","Bryson","Buck","Bud","Buddy","Bugsy","Burke","Burt","Burton","Buster","Buzz","Byrne","Byron","Bysshe","Cade","Caden","Caelan","Caiden","Cairo","Cal","Cale","Caleb","Callahan","Callan","Calvin","Cam","Camden","Cameron","Campbell","Camron","Camryn","Cannon","Carey","Carl","Carleton","Carlisle","Carlton","Carlyle","Carol","Carrol","Carson","Carter","Carver","Cary","Case","Casey","Cash","Casimir","Cason","Cass","Cassidy","Cat","Cavan","Cayden","Cayson","Cecil"];

    // 从列表中随机选择一个元素
    var randomIndex = Math.floor(Math.random() * items.length);
    var randomItem = items[randomIndex];

    // 将随机选择的元素显示在页面上
    document.getElementById("password").value = randomItem;
}
function getFemaleName() {
    // 定义一个字符串列表
    var items = ["Unique","Unity","Ursella","Ursula","Val","Valarie","Valary","Vale","Valerie","Valorie","Vanessa","Velda","Velma","Velvet","Venetia","Vera","Verity","Verna","Veronica","Vi","Vianne","Vic","Vicki","Vickie","Vicky","Victoria","Vienna","Vikki","Vinnie","Viola","Violet","Viona","Virgee","Virgie","Virginia","Vivian","Viviette","Vivyan","Vonda","Wallis","Wanda","Waverly","Wenda","Wendi","Wendy","Wenona","Whitney","Wilda","Wilfreda","Wilhelmina","Willa","Willie","Willow","Wilma","Windsor","Winifred","Winnie","Winnifred","Winona","Winter","Wisdom","Wisteria","Wren","Wrenlee","Wrenley","Wynona","Wynonna","Wynter","Xanthia","Xavia","Xaviera","Yancy","Yasmin","Yasmine","Yazmin","Yolanda","Yolonda","Yvette","Yvonne","Zandra","Zanna","Zara","Zaria","Zariah","Zavanna","Zavia","Zelda","Zella","Zelma","Zena","Zenia","Zinnia","Zoe","Zoë","Zoey","Zoie","Zola","Zowie","Zula","Scout","Seanna","Sela","Selby","Selina","Selma","September","Sequoia","Sera","Seraphina","Serena","Serenity","Serina","Serrena","Seven","Sevyn","Shae","Shaelyn","Shana","Shanae","Shanelle","Shanene","Shania","Shanna","Shannah","Shannen","Shannon","Shanon","Shantae","Shantel","Shantelle","Sharalyn","Shari","Sharise","Sharla","Sharleen","Sharlene","Sharmaine","Sharon","Sharona","Sharron","Sharyl","Sharyn","Shauna","Shavon","Shavonne","Shawn","Shawna","Shawnda","Shawnee","Shaye","Shayla","Shaylyn","Sheelagh","Sheena","Sheila","Shelagh","Shelby","Shelia","Shell","Shelley","Shelly","Shena","Sheree","Sheri","Sheridan","Sherie","Sherill","Sherilyn","Sherisse","Sherley","Sherlyn","Sherri","Sherrie","Sherry","Sheryl","Sheryll","Shevaun","Shevon","Shirlee","Shirley","Shonda","Shyla","Sibyl","Sidney","Sidony","Siena","Sienna","Sierra","Sigourney","Silver","Silvia","Simone","Simonette","Sinclair","Sindy","Sissie","Sissy","Sky","Skye","Skyla","Skylar","Skyler","Skylynn","Sloan","Sloane","Snow","Sommer","Sondra","Sonia","Sonya","Sookie","Sophia","Sophie","Sophy","Sorrel","Sparrow","Spirit","Spring","Stace","Stacee","Stacey","Staci","Stacia","Stacie","Stacy","Star","Starla","Starr","Stefani","Stella","Steph","Stephani","Stephania","Stephanie","Stephany","Stevie","Storm","Stormi","Stormy","Sue","Suellen","Suki","Sukie","Summer","Sunday","Sunny","Sunshine","Susan","Susanna","Susanne","Susie","Sutton","Suz","Suzan","Suzanna","Suzanne","Suzi","Suzie","Suzy","Sybella","Sybil","Syd","Sydne","Sydnee","Sydney","Sydnie","Sylvia","Symphony","Tabatha","Tabby","Tabitha","Tacey","Taegan","Tahlia","Tahnee","Talia","Tallulah","Tamara","Tameka","Tamela","Tamera","Tami","Tamika","Tammara","Tammi","Tammie","Tammy","Tamra","Tamsen","Tamsin","Tamsyn","Tamzen","Tania","Tansy","Tanya","Tanzi","Tara","Tarah","Tarina","Taryn","Tasha","Tatiana","Tatianna","Tatum","Tatyanna","Tawnee","Tawnie","Tawny","Tawnya","Tayla","Tayler","Taylor","Teagan","Teal","Teale","Teddie","Tegan","Temperance","Tempest","Temple","Tenley","Tera","Teresa","Teri","Terra","Terri","Terrie","Terry","Terry","Tess","Tessa","Tessie","Tetty","Thankful","Thea","Thelma","Theodora","Theresa","Therese","Thomasina","Tia","Tiana","Tianna","Tiara","Tibby","Tiffani","Tiffany","Tiffiny","Tigerlily","Tilda","Tillie","Tilly","Timotha","Tina","Tisha","Titty","Toby","Tommie","Toni","Tonia","Tonya","Topaz","Topsy","Tori","Toria","Tory","Tottie","Totty","Tracee","Tracey","Traci","Tracie","Tracy","Treasure","Trecia","Tresha","Tressa","Tria","Tricia","Trina","Trinity","Trish","Trisha","Trista","Tristen","Tristin","Trix","Trixie","Trudi","Trudie","Trudy","Tuesday","Twila","Twyla","Tyla","Tyra","Ulyssa","Una","Unice","Ora","Oralee","Oralie","Orinda","Orpha","Ottoline","Pacey","Page","Paget","Paige","Paislee","Paisley","Paityn","Palmer","Pam","Pamela","Pamelia","Pamella","Pamila","Pansy","Parker","Parnel","Parris","Pat","Patience","Patrice","Patricia","Patsy","Patti","Pattie","Patty","Paula","Pauleen","Paulene","Pauletta","Paulette","Paulina","Pauline","Payton","Peace","Pearl","Pearle","Pearlie","Peg","Peggie","Peggy","Pen","Pene","Penelope","Penny","Peony","Pepper","Perlie","Permelia","Pernel","Peronel","Peta","Petal","Petra","Petrina","Petronel","Petula","Petunia","Peyton","Phebe","Phemie","Pheobe","Philadelphia","Philipa","Philippa","Philis","Phillida","Phillipa","Phillis","Philomena","Phoebe","Phoenix","Phyliss","Phyllida","Phyllis","Piety","Pip","Piper","Pippa","Pleasance","Pollie","Polly","Poppy","Porsche","Portia","Posie","Posy","Praise","Precious","Presley","Primrose","Primula","Princess","Pris","Priscilla","Prissy","Promise","Pru","Prudence","Prue","Prunella","Purdie","Queen","Queenie","Quin","Quinlan","Quinn","Quintella","Rachael","Racheal","Rachel","Rachelle","Rachyl","Racquel","Rae","Raegan","Raelene","Raelyn","Raelynn","Raewyn","Rain","Rainbow","Raine","Raleigh","Ramona","Randi","Randy","Raquel","Raschelle","Raven","Ravenna","Raylene","Reagan","Reanna","Reannon","Reba","Rebecca","Rebeccah","Rebeccanne","Rebeckah","Rebekah","Reene","Reenie","Reese","Regan","Regana","Regena","Regina","Reign","Reilly","Remington","Remy","Rena","Renae","Rene","Renee","Renie","Renita","Retha","Reverie","Rexana","Rexanne","Rheanna","Rhetta","Rhianna","Rhiannon","Rhoda","Rhonda","Riannon","Rica","Richardine","Richelle","Richmal","Ricki","Ridley","Rikki","Riley","Rilla","Ripley","Rita","River","Robbie","Robena","Roberta","Robin","Robina","Robyn","Robynne","Rochelle","Romaine","Romayne","Romey","Romilly","Romy","Rona","Ronda","Roni","Ronnette","Ronnie","Rorie","Rory","Ros","Rosa","Rosabel","Rosabella","Rosalee","Rosaleen","Rosalie","Rosalin","Rosalind","Rosaline","Rosalyn","Rosalynne","Rosamond","Rosamund","Rosanna","Rosannah","Rosanne","Rose","Roseann","Roseanne","Roselyn","Rosemarie","Rosemary","Rosie","Roslyn","Rosy","Rowan","Rowanne","Rowena","Rowina","Roxana","Roxane","Roxanna","Roxanne","Roxie","Roxy","Royal","Royale","Royalty","Roz","Rozanne","Ruby","Rubye","Rue","Ruth","Ruthie","Ryana","Ryann","Ryanne","Rylee","Ryleigh","Ryley","Rylie","Sabella","Sable","Sabrina","Sabryna","Sadie","Saffron","Sage","Saige","Sal","Salem","Salena","Salina","Sallie","Sally","Salome","Sam","Samantha","Samara","Sammi","Sammie","Sammy","Sandie","Sandra","Sandy","Santana","Sapphire","Sara","Sarah","Saranna","Sarina","Sasha","Saundra","Savanna","Savannah","Sawyer","Saylor","Scarlet","Scarlett","Scarlette","Schuyler","Scottie","Magdalene","Maggie","Magnolia","Mahala","Mahalia","Maisie","Maisy","Maitland","Makayla","Makenna","Makenzie","Malandra","Malani","Malaysia","Maleah","Malia","Malinda","Maliyah","Mallory","Malone","Malvina","Mamie","Mandi","Mandy","Maple","Maralyn","Marcelyn","Marci","Marcia","Marcie","Marcy","Maree","Margaret","Margaretta","Marge","Margery","Margie","Margo","Margret","Maria","Mariabella","Mariah","Marian","Marianna","Marianne","Marie","Mariel","Marigold","Marilla","Marilou","Marilyn","Marilynn","Marina","Marinda","Marion","Maris","Marisa","Marissa","Marje","Marjorie","Marjory","Marla","Marlee","Marleen","Marlena","Marlene","Marley","Marlowe","Marly","Marlyn","Marni","Marnie","Marsha","Martha","Martie","Martina","Marva","Marvel","Mary","Mary","Maryann","Mary","Maryanne","Marybelle","Mary","Marybeth","Mary","Mary","Mary","Marylou","Marylu","Marylyn","Mathilda","Matilda","Mattie","Maud","Maude","Maudie","Maura","Maureen","Maurene","Maurie","Maurine","Mavis","Maxene","Maxie","Maxine","May","Maya","Maybelle","Maybelline","Mayme","Mckayla","McKenna","McKenzie","McKinley","Meade","Meadow","Meagan","Meaghan","Meg","Megan","Meghan","Mel","Melanie","Melantha","Melany","Melba","Melesina","Melicent","Melina","Melinda","Melissa","Mellony","Melody","Melva","Melyssa","Mercia","Mercy","Meredith","Merideth","Meridith","Meriel","Merilyn","Merla","Merle","Merletta","Merlyn","Merrilyn","Merrion","Merritt","Merry","Meryl","Mia","Mica","Michaela","Michayla","Michele","Michelle","Michelyne","Mickey","Midge","Mikayla","Mikhaila","Mikki","Milani","Mildred","Miley","Miller","Millicent","Millie","Milly","Mimi","Mina","Mindy","Minerva","Minnie","Minta","Minty","Mirabelle","Miracle","Miranda","Miriam","Missie","Missy","Misti","Misty","Mo","Modesty","Moira","Mollie","Molly","Mona","Monday","Monica","Monique","Monna","Monroe","Montana","Mora","Moreen","Morgan","Morgana","Moriah","Mozelle","Muriel","Murphy","Mya","Myla","Mylah","Myra","Myranda","Myrna","Myrtie","Myrtle","Mysie","Nadia","Nadine","Nan","Nance","Nancy","Nanette","Nannie","Nanny","Naomi","Narelle","Nat","Natalee","Natalia","Natalie","Natasha","Natille","Navy","Neely","Nelda","Nell","Nelle","Nellie","Nelly","Nena","Ness","Nessa","Netta","Nettie","Neva","Nevada","Nevaeh","Nia","Nichola","Nichole","Nicki","Nicky","Nicola","Nicole","Nigella","Niki","Nikki","Nikkole","Nikole","Nina","Nita","Noel","Noelene","Noelle","Nola","Nona","Nonie","Nora","Norah","Noreen","Norene","Norma","Normina","Nova","Novalee","Nyah","Nydia","Nyla","Nylah","Nyree","Oaklee","Oakleigh","Oakley","Oaklyn","Oaklynn","Ocean","Octavia","October","Odelia","Odell","Odetta","Olive","Olivia","Ollie","Olyvia","Oneida","Onyx","Opal","Opaline","Ophelia","Kiersten","Kiki","Kiley","Kilie","Kim","Kimber","Kimberlee","Kimberleigh","Kimberley","Kimberly","Kimberlyn","Kimbra","Kimmie","Kimmy","Kinley","Kinsey","Kinslee","Kinsley","Kira","Kirby","Kirrily","Kirsten","Kit","Kitty","Kizzie","Kizzy","Kolleen","Kori","Korrine","Kortney","Kourtney","Kris","Krista","Kristal","Kristeen","Kristen","Kristi","Kristia","Kristie","Kristin","Kristina","Kristine","Kristy","Krystal","Krystelle","Krysten","Krystina","Krystine","Krystle","Kyla","Kylee","Kyleigh","Kylie","Kym","Kyra","Kyrie","Kyrsten","Lacey","Laci","Lacie","Lacy","Laila","Lainey","Lake","Lalia","Lallie","Lally","Lana","Laney","Lara","Laraine","Larissa","Lark","Laryn","Laura","Lauraine","Laureen","Laurel","Laurelle","Lauren","Laurena","Laurencia","Laurene","Lauressa","Laurie","Laurinda","Laurissa","Lauryn","Lavena","Lavender","Lavern","Laverne","Lavina","Lavone","Lavonne","Layla","Leah","Leann","Leanna","Leanne","Leanora","Leatrice","Lecia","Lee","Leeann","Leesa","Legacy","Leigh","Leighton","Leila","Leilah","Leith","Lela","Lena","Lennie","Lennon","Lennox","Lenora","Lenore","Leola","Leona","Leone","Leontyne","Lesia","Lesleigh","Lesley","Leslie","Lesly","Lessie","Leta","Letha","Letitia","Lettice","Lettie","Letty","Lexa","Lexi","Lexia","Lexie","Lexine","Lexus","Lexy","Leyla","Liana","Lianne","Libbie","Libby","Liberty","Liddy","Lila","Lilac","Lilah","Lilian","Liliana","Lilianna","Lilibet","Lilibeth","Lillia","Lillian","Lilliana","Lillie","Lilly","Lily","Lilyrose","Lina","Linda","Linden","Lindsay","Lindsey","Lindsie","Lindy","Linette","Linnaea","Linnet","Linnette","Linnie","Linsay","Linsey","Linzi","Lisa","Lise","Lisette","Lisha","Lissa","Lita","Liv","Livia","Livvy","Livy","Liz","Liza","Lizbeth","Lizette","Lizzie","Lizzy","Logan","Lois","Lola","Lolicia","London","Londyn","Lora","Loraine","Lorainne","Lorayne","Loreen","Lorelai","Lorelei","Lorelle","Loren","Lorena","Lorene","Loretta","Lori","Lorie","Lorin","Lorinda","Lorine","Lorna","Lorraine","Lorri","Lorrie","Lorrin","Lottie","Lotus","Lou","Louella","Louisa","Louise","Love","Loyalty","Luana","Luann","Luanna","Luanne","Lucia","Lucile","Lucille","Lucinda","Lucy","Luella","Lula","Lulu","Luna","Luvenia","Luvinia","Lyda","Lydia","Lyla","Lylah","Lyn","Lynda","Lyndi","Lyndsay","Lyndsea","Lyndsey","Lynette","Lynn","Lynna","Lynne","Lynnette","Lynsay","Lynsey","Lyric","Lysette","Lyssa","Mabel","Mabella","Mabelle","Mable","Macey","Maci","Macie","Mackenzie","Macy","Madalyn","Maddie","Maddison","Maddy","Madelaine","Madeleine","Madelina","Madeline","Madelyn","Madelynn","Madge","Madi","Madilyn","Madilynn","Madison","Madisyn","Madlyn","Madoline","Madonna","Madyson","Mae","Maegan","Maeghan","Magdalen","Magdalena","Jannah","Jannette","Jannine","January","Jaqueline","Jaquelyn","Jaslene","Jaslyn","Jasmin","Jasmine","Jasmyn","Jaycee","Jayda","Jayde","Jayden","Jaye","Jayla","Jaylah","Jaylee","Jayleen","Jaylen","Jaylene","Jaylin","Jaylyn","Jaylynn","Jayma","Jayme","Jayna","Jayne","Jaynie","Jazlyn","Jazmin","Jazmine","Jazmyn","Jean","Jeana","Jeane","Jeanette","Jeanie","Jeanine","Jeanna","Jeanne","Jeannette","Jeannie","Jeannine","Jemima","Jemma","Jen","Jena","Jenae","Jenelle","Jenessa","Jeni","Jenifer","Jenn","Jenna","Jenni","Jennica","Jennie","Jennifer","Jenny","Jeri","Jerilyn","Jerri","Jerrie","Jerry","Jess","Jessa","Jessalyn","Jessamine","Jessamyn","Jessi","Jessica","Jessie","Jessika","Jessy","Jessye","Jewel","Jewell","Jill","Jillian","Jillie","Jilly","Jimmie","Jinny","Jo","Joan","Joandra","Joanie","Joann","Joanna","Jo-Anne","Joanne","JoBeth","Jocelin","Jocelyn","Jodene","Jodi","Jodie","Jody","Joella","Joelle","Joetta","Joey","Johanna","Johna","Johnie","Johnna","Johnnie","Joi","Joisse","Jojo","Joleen","Jolene","Jolie","Joline","Jonelle","Jonette","Joni","Jonie","Jonquil","Jools","Jordan","Jordana","Jordin","Jordyn","Jorie","Jorja","Josceline","Joselyn","Josepha","Josephina","Josephine","Josie","Joslyn","Joss","Josslyn","Journee","Journey","Journi","Joy","Joyce","Joye","Jream","Jude","Judi","Judie","Judith","Judy","Jules","Julia","Juliana","Julianna","Julianne","Julie","Juliet","July","June","Juniper","Justice","Justina","Justine","Justy","Kacey","Kacie","Kadence","Kae","Kaelea","Kaelee","Kaelyn","Kaety","Kaila","Kailee","Kailey","Kailyn","Kaitlin","Kaitlyn","Kaitlynn","Kaleigh","Kaley","Kali","Kalie","Kalla","Kallie","Kalyn","Kalysta","Kam","Kameron","Kamryn","Kandace","Kandi","Kara","Karaugh","Karen","Karena","Karina","Karissa","Karlee","Karlene","Karly","Karol","Karolyn","Karrie","Karsyn","Karyn","Kasandra","Kasey","Kassandra","Kassia","Kassidy","Kassie","Kassy","Kat","Kate","Katee","Katelin","Katelyn","Katelynn","Katey","Katharine","Katharyn","Katherina","Katherine","Katheryn","Katheryne","Kathi","Kathie","Kathleen","Kathlyn","Kathryn","Kathy","Katie","Katlyn","Katrina","Katy","Kay","Kaya","Kayce","Kaycee","Kayden","Kaydence","Kaye","Kayla","Kaylan","Kaylani","Kayleah","Kaylee","Kayleen","Kayleigh","Kaylen","Kayley","Kaylie","Kaylin","Kayly","Kaylyn","Kaylynn","Keanna","Keara","Keeleigh","Keeley","Keely","Kehlani","Keighley","Keila","Keira","Keitha","Kelcey","Kelda","Kelia","Kelleigh","Kelley","Kelli","Kellie","Kelly","Kelsea","Kelsey","Kelsi","Kelsie","Kendal","Kendall","Kendra","Kennedi","Kennedy","Kensley","Kenya","Kenzie","Kerena","Keri","Kerri","Kerrie","Kerry","Kestrel","Kevyn","Khloe","Kiana","Kianna","Kiara","Kiarra","Kiera","Kierra","Eulalia","Eunice","Euphemia","Eustacia","Eva","Evaline","Evalyn","Evangelina","Evangeline","Eve","Eveleen","Evelina","Eveline","Evelyn","Evelynn","Ever","Everest","Everlee","Everleigh","Everly","Evette","Evie","Evonne","Evvie","Fae","Faith","Faithe","Fallon","Fancy","Fannie","Fanny","Favour","Fawn","Fay","Faye","Felecia","Felicia","Felicity","Felisha","Femie","Fern","Ferne","Finley","Fiona","Flannery","Fleur","Fleurette","Flick","Flo","Floella","Flora","Florence","Floretta","Florrie","Florry","Flossie","Flower","Fortune","Fran","Francene","Frances","Francine","Francis","Frankie","Frannie","Franny","Freda","Freddie","Frederica","Freida","Freya","Frieda","Frona","Gabby","Gabriella","Gabrielle","Gaby","Gae","Gail","Gaila","Gale","Galilea","Gardenia","Garnet","Garnet","Garnett","Garnette","Gay","Gaye","Gayla","Gayle","Gaynor","Geena","Gemma","Gena","Genesis","Genette","Geneva","Genevieve","Genie","Georgeanna","Georgene","Georgetta","Georgia","Georgiana","Georgianna","Georgie","Georgina","Geraldine","Geralyn","Geri","Gerri","Gerry","Gertie","Gertrude","Giana","Gianna","Gift","Gifty","Gill","Gillian","Gina","Ginger","Ginnie","Ginny","Giselle","Gisselle","Githa","Gladys","Glenda","Glenna","Gloria","Gloriana","Glory","Goldie","Grace","Gracelyn","Gracelynn","Gracie","Gray","Greer","Greta","Gretchen","Gretta","Grey","Grier","Griselda","Gussie","Gwen","Gwenda","Gwendoline","Gwendolyn","Gwenevere","Gwyneth","Gypsy","Gytha","Hadley","Hadyn","Hailee","Hailey","Hailie","Haleigh","Haley","Halle","Hallie","Halo","Hannah","Happy","Harlee","Harleigh","Harley","Harlow","Harmonie","Harmony","Harper","Harriet","Harriett","Harrietta","Harriette","Hartley","Hattie","Hatty","Haven","Hayden","Haylee","Hayleigh","Hayley","Haylie","Haze","Hazel","Heather","Heaven","Heavenly","Heidi","Helen","Helena","Hellen","Henrietta","Hepsie","Hester","Hettie","Hilary","Hilda","Hildred","Hillary","Hollie","Hollis","Holly","Honey","Honor","Honora","Honour","Hope","Hortense","Hunter","Hyacinth","Hylda","Ibbie","Ida","Idella","Idelle","Idonea","Idony","Ilean","Ileen","Ilene","Imogen","Imogene","Ina","India","Indiana","Indie","Indigo","Indy","Inez","Iola","Iona","Ione","Ireland","Irene","Iris","Irma","Isabel","Isabella","Isabelle","Isadora","Isbel","Isebella","Isidora","Isla","Issy","Ivy","Izabelle","Izzy","Jacey","Jaci","Jacinda","Jacinth","Jackalyn","Jacki","Jackie","Jacklyn","Jaclyn","Jacqueline","Jacquelyn","Jacquetta","Jacqui","Jada","Jade","Jaden","Jadyn","Jae","Jaida","Jaiden","Jaime","Jaimie","Jaki","Jakki","Jamey","Jami","Jamie","2-Jan","Janae","Jane","Janeka","Janel","Janele","Janella","Janelle","Janene","Janessa","Janet","Janetta","Janette","Janey","Janice","Janie","Janine","Janis","Janna","Collyn","Columbine","Comfort","Connie","Constance","Cora","Coral","Cordelia","Coreen","Coretta","Cori","Coriander","Corie","Corina","Corinna","Corinne","Cornelia","Corrie","Corrina","Corrine","Cortney","Corynn","Courteney","Courtney","Cree","Cristen","Crystal","Cyan","Cybill","Cydney","Cymone","Cyndi","Cynthia","Cyrilla","Daffodil","Dahlia","Daisy","Dakota","Dale","Daley","Dallas","Daly","Dana","Danette","Dani","Danica","Daniela","Daniella","Danielle","Danika","Danita","Danna","Danni","Dannie","Daphne","Darby","Darcey","Darcie","D'Arcy","Darcy","Daria","Darian","Darla","Darleen","Darlene","Davena","Davida","Davina","Davinia","Dawn","Dayna","Deana","Deanna","Deanne","Deb","Debbi","Debbie","Debby","Debi","Deborah","Debra","Dee","Deeann","Deedee","Deena","Deidra","Deidre","Deirdre","Deitra","Delaney","Delia","Delia","Delice","Delicia","Delight","Delilah","Dell","Della","Delma","Delora","Delores","Deloris","Delphia","Delta","Demelza","Demetria","Demi","Dena","Dene","Denice","Denise","Deonne","Derby","Desi","Desirae","Desiree","Destinee","Destiny","Detta","Devan","Devin","Devon","Devyn","Dezi","Deziree","Di","Diamond","Diana","Diane","Diann","Dianna","Dianne","Diantha","Dina","Dinah","Dione","Dionne","Dior","Dixie","Docia","Dodie","Dollie","Dolly","Dolores","Dominica","Dona","Donelle","Donna","Dora","Dorean","Doreen","Doretta","Doria","Dorinda","Dorine","Doris","Dorothea","Dorothy","Dorris","Dortha","Dorthy","Dory","Dot","Dottie","Dotty","Dove","Drea","Dream","Dreda","Drina","Duana","Dulcibella","Dulcie","Dusty","Dyan","Earleen","Earlene","Earline","Earnestine","Eartha","Easter","Ebba","Eddie","Eden","Edie","Edith","Editha","Edna","Edweena","Edwena","Edwina","Edwyna","Edytha","Edythe","Effie","Eglantine","Egypt","Eileen","Eireen","Elaina","Elaine","Elea","Eleanor","Eleanora","Eleanore","Elena","Elenora","Elfleda","Elfreda","Elfrida","Elfrieda","Eliana","Elianna","Elicia","Elinor","Elisa","Elisabeth","Elise","Elissa","Eliza","Elizabeth","Ella","Ella","Elle","Ellen","Ellery","Elliana","Ellie","Ellington","Ellis","Elly","Elma","Elnora","Elodie","Eloise","Elora","Elouise","Elsa","Elsabeth","Elsie","Elvina","Elyse","Elyzabeth","Em","Emalee","Ember","Emberly","Emelia","Emely","Emerald","Emerie","Emerson","Emersyn","Emery","Emilee","Emilia","Emily","Emma","Emmaline","Emmalyn","Emmeline","Emmerson","Emmie","Emmy","Emmylou","Emory","Enid","Enola","Epiphany","Eppie","Erica","Ericka","Erika","Erin","Erma","Ermintrude","Ernestine","Erykah","Eryn","Esmae","Esmaralda","Esme","Esmé","Esmée","Esmee","Esmeralda","Essence","Essie","Esta","Estella","Estelle","Esther","Ethel","Ethelinda","Ethelyn","Etta","Ettie","Eugenia","Eugenie","Eula","Berny","Berry","Bertha","Bertie","Bertina","Beryl","Bess","Bessie","Beth","Bethanie","Bethany","Bethel","Bethney","Betony","Betsy","Bette","Bettie","Betty","Bettye","Beulah","Bev","Beverley","Beverly","Biddy","Billie","Bindy","Birdie","Blair","Blaire","Blake","Blakely","Blanch","Blanche","Blessing","Blondie","Blossom","Blue","Blythe","Bobbi","Bobbie","Bonita","Bonnie","Bowie","Braelyn","Braelynn","Braidy","Branda","Brande","Brandee","Brandi","Brandie","Brandy","Breana","Breann","Breanna","Breanne","Bree","Brenda","Brenna","Bria","Briana","Brianna","Brianne","Briar","Bridget","Bridgette","Brie","Briella","Brielle","Briley","Brinley","Briony","Bristol","Britannia","Britney","Brittani","Brittania","Brittany","Brittney","Brittni","Brittny","Bronte","Bronwyn","Brook","Brooke","Brooklyn","Brooklynn","Bryana","Bryanna","Bryanne","Brylee","Bryn","Brynlee","Brynn","Brynne","Bryony","Buffy","Bunny","Burgundy","Cadence","Caelie","Caetlin","Caileigh","Cailin","Cailyn","Caitlin","Caitlyn","Calanthe","Calanthia","Caleigh","Cali","Calista","Calla","Calleigh","Callie","Callista","Cam","Camellia","Cameron","Camilla","Camille","Cammie","Campbell","Camryn","Candace","Candi","Candice","Candida","Candis","Candy","Candyce","Capri","Caprice","Capricia","Cara","Careen","Caren","Carey","Cari","Carina","Caris","Carissa","Carla","Carlene","Carley","Carlie","Carlisa","Carlisle","Carly","Carlyn","Carmel","Carmella","Carmen","Carol","Carolann","Carolina","Caroline","Carolyn","Carreen","Carrie","Carrol","Carry","Carson","Cary","Caryl","Caryn","Casey","Cass","Cassandra","Cassarah","Cassidy","Cassie","Cassy","Cat","Cate","Catharine","Catherin","Catherina","Catherine","Cathleen","Cathryn","Cathy","Cayla","Caylee","Cayley","Ceara","Cearra","Cece","Cecelia","Cecilia","Cecily","Cedar","Celandine","Celeste","Celestine","Celia","Celinda","Celine","Chalice","Chandler","Chanel","Chanelle","Channing","Chantal","Chanté","Chantel","Chantelle","Charisma","Charissa","Charisse","Charity","Charla","Charlee","Charleen","Charleigh","Charlene","Charley","Charli","Charlie","Charlotte","Charmaine","Charnette","Chasity","Chastity","Chelle","Chelsea","Chelsey","Chelsie","Cher","Cherette","Cheri","Cherice","Cherie","Cherilyn","Cherise","Cherish","Cherokee","Cherry","Cherryl","Cheryl","Chesley","Chevonne","Cheyanne","Cheyenne","China","Chloe","Chloë","Chris","Chrissie","Chrissy","Christa","Christabel","Christabella","Christabelle","Christal","Christen","Christi","Christiana","Christie","Christina","Christine","Christmas","Christobel","Christy","Chrysanta","Chrystal","Chyna","Ciara","Cicely","Ciera","Cierra","Cinda","Cindi","Cindra","Cindy","Cissy","Claire","Clancy","Clara","Clare","Clarette","Claribel","Clarice","Clarinda","Clarissa","Clarity","Claudia","Clematis","Clemence","Clemency","Clementine","Cleo","Clotilda","Clover","Coby","Codie","Coleen","Colene","Colleen","Collins","Aaliyah","Aaralyn","Aaren","Abbey","Abbi","Abbie","Abby","Abegail","Abi","Abigail","Abigale","Abigayle","Abilene","Acacia","Ada","Adair","Adaline","Adalyn","Adalynn","Adamina","Addie","Addilyn","Addison","Addy","Addyson","Adela","Adelaide","Adele","Adelia","Adeline","Adella","Adelle","Adelyn","Adelynn","Adena","Adria","Adriana","Adrianna","Adrianne","Adrienne","Agatha","Aggie","Agnes","Aileen","Aimee","Ainslee","Ainsley","Ainslie","Alaia","Alaina","Alaiya","Alana","Alani","Alanis","Alanna","Alannah","Alannis","Alaya","Alayah","Alayna","Alberta","Alea","Aleah","Alease","Alecia","Aleesha","Alene","Alesha","Alesia","Aleta","Aletha","Alethea","Alex","Alexa","Alexandra","Alexandrea","Alexandria","Alexandrina","Alexia","Alexina","Alexis","Alexus","Alfreda","Ali","Aliah","Alice","Alicia","Aline","Alise","Alisha","Alishia","Alisia","Alison","Alissa","Alisya","Alita","Alivia","Allana","Allannah","Allegra","Allie","Allison","Allissa","Ally","Allycia","Allyn","Allyson","Alma","Alora","Alpha","Alvena","Alvina","Alyce","Alycia","Alys","Alysa","Alyse","Alysha","Alysia","Alyson","Alyssa","Alyssia","Alyx","Amabel","Amanda","Amaya","Amayah","Amber","Amberly","Amberlynn","Ambrosine","Amelia","America","Amery","Amethyst","Ami","Amie","Amilia","Amity","Amora","Amoura","Amy","Anabella","Anabelle","Anastasia","Anaya","Andi","Andie","Andrea","Andrina","Andy","Anemone","Angel","Angela","Angelia","Angelica","Angelina","Angelle","Angie","Anima","Anise","Anissa","Anita","Anjanette","Anjelica","Ann","Anna","Annabel","Annabella","Annabelle","Annabeth","Annalee","Annalise","Anne","Anneka","Annette","Annice","Annie","Annika","Annis","Annmarie","Annora","Anona","Ansley","Antonette","Antonia","Apple","April","Arabella","Araminta","Ardath","Arden","Ardith","Aretha","Aria","Ariah","Ariana","Arianna","Ariel","Ariella","Arienne","Arin","Ariyah","Arleen","Arlene","Arlie","Arline","Armani","Artie","Aryana","Ash","Ashlea","Ashlee","Ashleigh","Ashley","Ashlie","Ashlyn","Ashlynn","Ashton","Ashtyn","Asia","Aspen","Aspyn","Aster","Aston","Astoria","Astra","Astrid","Athena","Aubree","Aubrey","Aubriana","Aubrianna","Aubrie","Aubrielle","Audie","Audra","Audrea","Audrey","Augusta","Aura","Aureole","Aurora","Austyn","Autumn","Ava","Avah","Avaline","Avalon","Aveline","Averie","Averill","Avery","Aviana","Avianna","Avice","Avis","Avonlea","Avril","Ayla","Azalea","Azaria","Azura","Azure","Babe","Babette","Babs","Bailee","Bailey","Bambi","Barb","Barbara","Barbie","Barbra","Baylee","Bayley","Baylor","Bea","Beatrice","Beatrix","Beau","Becca","Becci","Beck","Becka","Beckah","Becky","Bee","Bekki","Belinda","Bella","Bellamy","Belle","Berenice","Bernadette","Bernadine","Bernetta","Bernice","Bernie","Berniece"];

    // 从列表中随机选择一个元素
    var randomIndex = Math.floor(Math.random() * items.length);
    var randomItem = items[randomIndex];

    // 将随机选择的元素显示在页面上
    document.getElementById("password").value = randomItem;
}

const textToCopy = `
http://tracker.gbitt.info/announce
https://tracker.lilithraws.cf/announce
https://tracker1.520.jp/announce
http://www.wareztorrent.com/announce
https://tr.burnabyhighstar.com/announce
http://tk.greedland.net/announce
http://trackme.theom.nz:80/announce
https://tracker.foreverpirates.co:443/announce
http://tracker3.ctix.cn:8080/announce
https://tracker.m-team.cc/announce.php
https://tracker.gbitt.info:443/announce
https://tracker.loligirl.cn/announce
https://tp.m-team.cc:443/announce.php
https://tr.abir.ga/announce
http://tracker.electro-torrent.pl/announce
http://1337.abcvg.info/announce
https://trackme.theom.nz:443/announce
https://tracker.tamersunion.org:443/announce
https://tr.abiir.top/announce
wss://tracker.openwebtorrent.com:443/announce
http://www.all4nothin.net:80/announce.php
https://tracker.kuroy.me:443/announce
https://1337.abcvg.info:443/announce
http://torrentsmd.com:8080/announce
https://tracker.gbitt.info/announce
https://tp.m-team.cc/announce.php
https://tracker.lilithraws.org:443/announce
https://tracker.loligirl.cn:443/announce
https://tr.abiir.top:443/announce
http://tracker.anirena.com/announce
https://tracker.kuroy.me/announce
http://tracker.anirena.com:80/announce
https://tr.abir.ga:443/announce
https://tracker.tamersunion.org/announce
http://btx.anifilm.tv:80/announce.php
https://tr.fuckbitcoin.xyz:443/announce
https://abir0dev.github.io/announce
https://tr.ready4.icu:443/announce
https://tracker.nanoha.org/announce
https://tracker1.520.jp:443/announce
https://tracker.imgoingto.icu:443/announce
https://tr.ready4.icu/announce
https://tracker.imgoingto.icu/announce
https://t.btcland.xyz:443/announce
http://tracker.electro-torrent.pl:80/announce
https://tracker1.loli.co.nz/announce
http://torrent.mp3quran.net:80/announce.php
https://tracker.feb217.tk:8443/announce
https://tr.fuckbitcoin.xyz/announce
http://tracker.bt4g.com:2095/announce
http://www.xwt-classics.net:80/announce.php
https://t.btcland.xyz/announce
https://tracker.parrotlinux.org:443/announce
https://tracker.foreverpirates.co/announce
http://www.thetradersden.org/forums/tracker:80/announce.php
https://tracker.parrotlinux.org/announce
https://bittorrent.gongt.net:443/announce
http://bt.rghost.net/announce
http://tracker.iro.moe/announce
https://tracker.parrotsec.org:443/announce
https://tracker.lilithraws.cf:443/announce
https://tracker.parrotsec.org/announce
https://tracker.dmhy.pw/announce
https://tr.burnabyhighstar.com:443/announce
http://60-fps.org:80/bt:80/announce.php
http://tracker.gbitt.info:80/announce
http://jp.moeweb.pw:6969/announce
https://w.wwwww.wtf/announce
https://carbon-bonsai-621.appspot.com/announce
udp://tracker.dler.org:6969/announce
https://cernet-tracker.appspot.com:443/announce
http://www.wareztorrent.com:80/announce
udp://960303.xyz:6969/announce
http://tracker.h0me.cc:8880/announce
https://tracker.expli.top/announce
https://tracker.feb217.tk/announce
http://tracker.torrentyorg.pl:80/announce
http://tracker.torrentyorg.pl/announce
https://tracker.baka.ink/announce
https://1337.abcvg.info/announce
https://tracker.baka.ink:443/announce
https://opentracker.cc:443/announce
http://bt.rghost.net:80/announce
http://all4nothin.net:80/announce.php
http://t.nyaatracker.com:80/announce
udp://laze.cc:6969/announce
https://tracker.moeblog.cn:443/announce
http://tracker1.bt.moack.co.kr/announce
https://tracker.lilithraws.org/announce
http://carbon-bonsai-621.appspot.com:80/announce
https://carbon-bonsai-621.appspot.com:443/announce
https://tracker.nanoha.org:443/announce
http://tracker3.ctix.cn:2095/announce
http://207.241.226.111:6969/announce
https://tracker.sakurato.art:23334/announce
http://open.nyap2p.com:8080/announce
http://1337.abcvg.info:80/announce
http://masters-tb.com:80/announce.php
https://tracker1.ctix.cn/announce
https://trackme.theom.nz/announce
https://opentracker.cc/announce
http://207.241.231.226:6969/announce
udp://smtp-relay.odysseylabel.com.au:6969/announce
http://51.38.230.101/announce
http://share.camoe.cn:8080/announce
http://t.nyaatracker.com/announce
http://kinorun.com:80/announce.php
http://t.acg.rip:6699/announce
http://torrentzilla.org:80/announce
udp://vibe.sleepyinternetfun.xyz:1738/announce
http://54.39.98.124/announce
http://54.39.98.124:80/announce
http://nyaa.tracker.wf:7777/announce
http://www.legittorrents.info:80/announce.php
udp://bubu.mapfactor.com:6969/announce
http://tracker.ygsub.com:6969/announce
udp://open.tracker.ink:6969/announce
http://open.tracker.ink:6969/announce
http://www.yqzuji.com:80/announce
http://tracker.ali213.net:8000/announce
http://bt.edwardk.info:6969/announce
http://mixfiend.com:6969/announce
http://tracker.hiyj.cn/announce
http://51.81.46.170:6969/announce
https://opentracker.i2p.rocks/announce
https://opentracker.i2p.rocks:443/announce
https://trakx.herokuapp.com:443/announce
https://trakx.herokuapp.com/announce
udp://tracker.tcp.exchange:6969/announce
http://bt.okmp3.ru:2710/announce
http://bt.ali213.net:8000/announce
udp://tracker.army:6969/announce
udp://torrents.artixlinux.org:6969/announce
https://t.quic.ws/announce
udp://bt1.archive.org:6969/announce
udp://bt2.archive.org:6969/announce
http://tracker.dler.org:6969/announce
udp://moonburrow.club:6969/announce
http://fxtt.ru/announce
https://tr.bangumi.moe:9696/announce
udp://black-bird.ynh.fr:6969/announce
http://tracker2.dler.org:80/announce
http://93.158.213.92:1337/announce
http://www.zone-torrent.net:80/announce.php
udp://tracker.auctor.tv:6969/announce
http://tracker.dler.com:6969/announce
udp://tracker.filemail.com:6969/announce
udp://theodoric.fr:6969/announce
udp://tracker.bitsearch.to:1337/announce
udp://mail.zasaonsk.ga:6969/announce
http://data-bg.net:80/announce.php
http://open.acgnxtracker.com/announce
http://tracker.pussytorrents.org:3000/announce
http://tracker.noobsubs.net:80/announce
http://baibako.tv:80/announce
http://tracker.noobsubs.net/announce
http://opentracker.xyz/announce
https://tracker.4.babico.name.tr/announce
http://open.acgnxtracker.com:80/announce
udp://tracker2.dler.org:80/announce
https://xtremex.herokuapp.com:443/announce
udp://app.icon256.com:8000/announce
udp://fe.dealclub.de:6969/announce
udp://qtstm32fan.ru:6969/announce
http://tracker2.dler.org/announce
http://t2.pow7.com/announce
udp://psyco.fr:6969/announce
https://open.kickasstracker.com/announce
udp://keke.re:6969/announce
http://tracker3.dler.org:2710/announce
udp://tracker.publictracker.xyz:6969/announce
udp://uploads.gamecoast.net:6969/announce
https://open.kickasstracker.com:443/announce
https://xtremex.herokuapp.com/announce
udp://htz3.noho.st:6969/announce
udp://concen.org:6969/announce
udp://thouvenin.cloud:6969/announce
https://tracker.publictorrent.net:443/announce
http://ipv4announce.sktorrent.eu:6969/announce
http://tracker.tfile.me/announce
http://tracker.minglong.org:8080/announce
udp://open.stealth.si:80/announce
http://anidex.moe:6969/announce
udp://tracker.ccc.de:80/announce
udp://sanincode.com:6969/announce
http://t1.chfs.ch:6969/announce
https://torrents.linuxmint.com:443/announce.php
http://tracker.tambovnet.org:80/announce.php
http://tracker.acgnx.se/announce
https://tracker.nyaa.tk/announce
http://tracker.btsync.gq:233/announce
udp://camera.lei001.com:6969/announce
http://tracker.gcvchp.com:2710/announce
http://tracker.mywaifu.best:6969/announce
udp://bt.oiyo.tk:6969/announce
http://open.trackerlist.xyz/announce
udp://run.publictracker.xyz:6969/announce
http://tr.kxmp.cf:80/announce
http://tracker.acgnx.se:80/announce
http://tracker.corpscorp.online/announce
http://milanesitracker.tekcities.com:80/announce
http://openbittorrent.com:80/announce
http://tracker.xiaoduola.xyz:6969/announce
http://milanesitracker.tekcities.com/announce
http://tracker.vrpnet.org:6969/announce
http://opentracker.acgnx.se/announce
http://torrent-team.net:80/announce.php
udp://public.publictracker.xyz:6969/announce
http://torrent-team.net/announce.php
udp://new-line.net:6969/announce
http://95.107.48.115:80/announce
http://95.107.48.115/announce
http://sukebei.tracker.wf:8888/announce
udp://astrr.ru:6969/announce
http://bt2.edwardk.info:4040/announce
udp://bt.ktrackers.com:6666/announce
http://vps02.net.orel.ru/announce
http://opentracker.i2p.rocks:6969/announce
http://highteahop.top:6960/announce
http://opentracker.acgnx.com:6869/announce
udp://zecircle.xyz:6969/announce
http://tracker810.xyz:11450/announce
http://rstracker.ohys.net:80/announce
udp://tracker.0x.tf:6969/announce
http://open.trackerlist.xyz:80/announce
https://tracker.bt-hash.com:443/announce
http://torrentzilla.org:80/announce.php
udp://opentracker.i2p.rocks:6969/announce
http://tracker.ipv6tracker.org/announce
udp://v2.iperson.xyz:6969/announce
http://trun.tom.ru/announce
http://bt.zlofenix.org:81/announce
https://torrent.ubuntu.com:443/announce
https://tracker.iriseden.fr/announce
http://retracker.spark-rostov.ru/announce
http://home.yxgz.club:6969/announce
http://tracker.corpscorp.online:80/announce
http://trun.tom.ru:80/announce
http://tr.kxmp.cf/announce
https://tracker.iriseden.fr:443/announce
https://www.wareztorrent.com:443/announce
http://torrentzilla.org/announce
udp://tracker2.dler.com:80/announce
http://concen.org:6969/announce
http://btracker.top:11451/announce
http://www.worldboxingvideoarchive.com:80/announce.php
http://tracker.trackerfix.com:80/announce
udp://opentrackr.org:1337/announce
http://tracker4.itzmx.com:2710/announce
udp://cutscloud.duckdns.org:6969/announce
http://bt1.xxxxbt.cc:6969/announce
http://opentracker.xyz:80/announce
udp://yahor.ftp.sh:6969/announce
http://tracker.opentrackr.org:1337/announce
udp://tracker.swateam.org.uk:2710/announce
udp://tracker.opentrackr.org:1337/announce
https://opentracker.xyz/announce
http://fxtt.ru:80/announce
udp://yann5.hexanyn.fr:6969/announce
https://opentracker.xyz:443/announce
udp://rutorrent.frontline-mod.com:6969/announce
http://t.overflow.biz:6969/announce
http://tracker.dmcomic.org:2710/announce
http://tracker.ipv6tracker.org:80/announce
http://tracker.tfile.me:80/announce
udp://tracker.trackerfix.com:82/announce
udp://open.free-tracker.ga:6969/announce
http://retracker.ohys.net:80/announce
http://torrenttracker.nwc.acsalaska.net:6969/announce
http://www.tvnihon.com:6969/announce
udp://shizzle.hammetjus.nl:6969/announce
http://openbittorrent.com/announce
http://irrenhaus.dyndns.dk:80/announce.php
udp://epider.me:6969/announce
udp://6ahddutb1ucc3cp.ru:6969/announce
https://tracker.moeblog.cn/announce
http://incine.ru:6969/announce
http://tracker.xdvdz.com:2710/announce
http://siambit.org/announce.php
udp://tracker.blacksparrowmedia.net:6969/announce
http://retracker.joxnet.ru:80/announce
http://bttracker.debian.org:6969/announce
udp://tracker.pomf.se:80/announce
http://tracker.dutchtracking.nl/announce
udp://nagios.tks.sumy.ua:80/announce
http://tracker.dutchtracking.nl:80/announce
http://tracker.torrentbytes.net:80/announce.php
udp://ben.kerbertools.xyz:6969/announce
https://t.quic.ws:443/announce
udp://rep-art.ynh.fr:6969/announce
udp://fh2.cmp-gaming.com:6969/announce
udp://tamas3.ynh.fr:6969/announce
http://bluebird-hd.org:80/announce.php
https://tracker.bt-hash.com/announce
http://open.miotracker.com/announce
http://retracker.spark-rostov.ru:80/announce
http://siambit.com:80/announce.php
http://vps02.net.orel.ru:80/announce
https://tracker.opentracker.se:443/announce
http://tracker.nucozer-tracker.ml:2710/announce
https://tracker.dnlab.net/announce
http://tracker.breizh.pm:6969/announce
http://www.tribalmixes.com:80/announce.php
http://tracker.bittor.pw:1337/announce
udp://tracker.sylphix.com:6969/announce
http://tracker.trackerfix.com/announce
udp://chouchou.top:8080/announce
https://tracker.jiesen.life:8443/announce
udp://run-2.publictracker.xyz:6969/announce
udp://tsundere.pw:6969/announce
udp://movies.zsw.ca:6969/announce
udp://open.demonii.com:1337/announce
udp://tracker.dler.com:6969/announce
http://t1.pow7.com/announce
http://fe.dealclub.de:6969/announce
udp://tracker.tiny-vps.com:6969/announce
http://tracker.tiny-vps.com:6969/announce
http://buny.uk:6969/announce
udp://tracker.ddunlimited.net:6969/announce
udp://tracker.monitorit4.me:6969/announce
http://retracker.joxnet.ru/announce
http://torrent.fedoraproject.org:6969/announce
http://mvgroup.org:2710/announce
http://btx.anifilm.tv/announce.php
wss://qot.abiir.top:443/announce
http://all4nothin.net/announce.php
http://xtremewrestlingtorrents.net/announce.php
http://www.thetradersden.org/forums/tracker/announce.php
http://60-fps.org/bt/announce.php
http://datascene.net/announce.php
http://156.234.201.18/announce
http://61.216.109.95:6969/announce
http://61.216.166.123:6969/announce
http://tracker1.bt.moack.co.kr:80/announce
http://bt.beatrice-raws.org/announce
http://www.xwt-classics.net/announce.php
http://torrent.mp3quran.net/announce.php
http://171.104.226.25:6969/announce
https://x7x.up.railway.app/announce
http://34.94.213.23/announce
http://34.94.213.23:11451/announce
http://34.94.213.23:2710/announce
http://106.14.254.164:6969/announce
http://www.all4nothin.net/announce.php
http://masters-tb.com/announce.php
https://www.wareztorrent.com/announce
http://107.152.127.9:6969/announce
http://trackme.theom.nz/announce
http://www.legittorrents.info/announce.php
http://kinorun.com/announce.php
http://bt.edwardk.info:2710/announce
http://51.81.200.170:6699/announce
http://bt.edwardk.info:4040/announce
http://35.227.12.84/announce
http://35.227.12.84:2710/announce
http://bt2.edwardk.info:6969/announce
http://tracker.kali.org:6969/announce
http://mixfiend.com/announce.php
http://34.89.30.59/announce
http://34.89.30.59:2710/announce
http://212.6.3.67/announce
http://185.70.187.79:6969/announce
udp://public.tracker.vraphim.com:6969/announce
http://185.185.40.95:6969/announce
udp://tr.bangumi.moe:6969/announce
wss://tracker.dnlab.net:443/announce
http://185.148.3.231/announce
http://tracker.sushirave.net/announce
http://baibako.tv/announce
http://siambit.com/announce.php
http://tracker.trancetraffic.com/announce.php
http://144.76.118.107:6969/announce
http://irrenhaus.dyndns.dk/announce.php
http://torrents.hikarinokiseki.com:6969/announce
http://www.worldboxingvideoarchive.com/announce.php
http://www.zone-torrent.net/announce.php
http://uatracker.net/announce.php
http://95.217.167.10:6969/announce
http://tracker.frozen-layer.net:6969/announce
http://217.30.10.18:6969/announce
http://bt-club.ws/announce
https://torrents.linuxmint.com/announce.php
http://torrentzilla.org/announce.php
http://5.188.6.45:6969/announce
http://93.88.129.16/announce
http://65.108.2.176:2710/announce
http://37.235.174.46:2710/announce
http://tracker.tambovnet.org/announce.php
http://data-bg.net/announce.php
https://tracker.logirl.moe/announce
http://bt2.edwardk.info:2710/announce
http://tracker3.itzmx.com:8080/announce
http://pow7.com:80/announce
http://torrent.arjlover.net:2710/announce
http://torrents.linuxmint.com/announce.php
http://announce.partis.si/announce
http://proaudiotorrents.org/announce.php
https://torrent.ubuntu.com/announce
http://movies.zsw.ca:6969/announce
http://torrent.ubuntu.com:6969/announce
http://mvgforumtracker.mvgroup.org/tracker.php/announce
http://blackz.ro/announce.php
http://tracker.gigatorrents.ws:2710/announce
http://tracker.linkomanija.org:2710/announce
http://torrent.unix-ag.uni-kl.de/announce
http://open.touki.ru/announce.php
http://tracker.skyts.net:6969/announce
http://alltorrents.net/bt/announce.php
http://tracker.torrentbytes.net/announce.php
udp://mts.tvbit.co:6969/announce
http://www.tribalmixes.com/announce.php
http://bluebird-hd.org/announce.php
http://www.mvgroup.org:2710/announce
http://www.mvgroup.org/tracker.php/announce
http://tracker2.ctix.cn:2095/announce
http://www.megatorrents.kg/announce.php
http://209.209.112.121:2710/announce
http://tracker.openbittorrent.com:80/announce
http://5.182.206.171:1096/announce
http://h4.trakx.nibba.trade:80/announce
http://pow7.com/announce
http://atrack.pow7.com:80/announce
http://fosstorrents.com:6969/announce
http://tracker.ddunlimited.net:6969/announce
http://tracker.ali213.net:8080/announce
http://secure.pow7.com/announce
udp://admin.videoenpoche.info:6969/announce
http://t1.pow7.com:80/announce
http://bt.ali213.net:8080/announce
udp://tracker.skyts.net:6969/announce
http://tracker.frozen-layer.com:6969/announce
https://w.wwwww.wtf:443/announce
udp://tracker1.bt.moack.co.kr:80/announce
http://tr.bangumi.moe:6969/announce
https://tr.bangumi.moe:6969/announce
http://167.235.245.209/announce
http://tracker.frozen-layer.net:6969/announce.php
http://chouchou.top:8080/announce
udp://tracker1.itzmx.com:8080/announce
udp://retracker.lanta-net.ru:2710/announce
https://tracker2.ctix.cn:443/announce
https://tracker.m-team.cc:443/announce.php
https://tracker.vectahosting.eu:443/announce
https://tracker.expli.top:443/announce
http://ftp.pet:7777/announce
http://45.154.253.7/announce
http://0d.kebhana.mx:443/announce
http://open.touki.ru/announce
udp://tracker.trackerfix.com:80/announce
udp://download.nerocloud.me:6969/announce
udp://slicie.icon256.com:8000/announce
http://tracker1.itzmx.com:8080/announce
http://163.172.209.40/announce
udp://tracker.openbittorrent.com:80/announce
http://open.acgtracker.com:1096/announce
udp://mail.artixlinux.org:6969/announce
udp://ns-1.x-fins.com:6969/announce
udp://tracker.artixlinux.org:6969/announce
udp://leefafa.tk:6969/announce
udp://open.4ever.tk:6969/announce
http://211.20.122.47:6969/announce
http://119.28.71.45:8080/announce
http://tracker.etree.org:6969/announce
https://tracker2.ctix.cn/announce
http://h4.trakx.nibba.trade/announce
http://187.57.14.62:6969/announce
udp://srv5.digiboy.ir:6969/announce
http://45.154.253.4/announce
http://bt.endpot.com/announce
https://tracker.cyber-hub.net/announce
http://tracker4.itzmx.com:6961/announce
http://141.144.224.250:2710/announce
http://open.touki.ru:80/announce.php
http://185.216.178.49:6969/announce
http://atrack.pow7.com/announce
http://t2.pow7.com:80/announce
http://widemus.de:6969/announce
http://tracker.vraphim.com:6969/announce
http://163.172.209.40:80/announce
http://141.144.224.250:6969/announce
http://45.154.253.5/announce
http://tracker.internetwarriors.net:1337/announce
https://tracker.torrentsnows.com/announce
udp://tracker.internetwarriors.net:1337/announce
udp://open.tracker.cl:1337/announce
http://45.154.253.6/announce
https://abir0dev.github.io:443/announce
http://tracker.lintk.me:2710/announce
udp://tracker.zemoj.com:6969/announce
https://tracker.loli.co.nz/announce
udp://tracker4.itzmx.com:2710/announce
https://t1.tokhmi.xyz/announce
http://tracker.anirena.com:80/b16a15d9a238d1f59178d3614b857290/announce
https://bittorrent.gongt.net/announce
https://tracker1.ctix.cn:443/announce
http://private.minimafia.nl:443/announce
udp://tracker.srv00.com:6969/announce
http://193.37.214.12:6969/announce
http://tracker.srv00.com:6969/announce
http://tracker.publictorrent.net:80/announce
http://198.251.84.144/announce
http://opentracker.acgnx.se:80/announce
http://share.hkg-fansub.info/announce.php
http://prestige.minimafia.nl:443/announce
http://tracker.srv00.com:80/announce
https://tracker.srv00.com/announce
https://tracker.publictorrent.net/announce
http://t.jaekr.sh:6969/announce
https://seeders-paradise.org/announce
http://finbytes.org/announce.php
http://opentrackr.org:1337/announce
http://bt.nnm-club.info:2710/announce
http://bt.3kb.xyz:80/announce
http://bt.3kb.xyz/announce
udp://104.143.10.186:8000/announce
http://retracker.ohys.net/announce
http://mediaclub.tv/announce.php
http://mediaclub.tv/announce
http://171.104.111.30:6969/announce
http://mediaclub.tv:80/announce.php
http://tracker.openbittorrent.com/announce
http://tracker.srv00.com/announce
http://200.232.254.1:6969/announce
http://116.252.176.125:6969/announce
http://grifon.info/announce
http://grifon.info:80/announce
http://tracker.sakurato.art:23333/announce
http://li1406-230.members.linode.com:6969/announce
http://vps-dd0a0715.vps.ovh.net:6969/announce
http://parag.rs:6969/announce
http://datascene.net:80/announce.php
http://51.68.122.172:80/announce
http://wepzone.net:6969/announce
http://www.genesis-sp.org:2710/announce
http://carbon-bonsai-621.appspot.com/announce
http://60-fps.org/bt:80/announce.php
http://104.143.10.186:8000/announce
http://tracker3.itzmx.com:6961/announce
https://tracker.dmhy.pw:443/announce
https://tracker1.loli.co.nz:443/announce
http://www.torrentsnipe.info:2701/announce
https://tracker.lelux.fi:443/announce
http://tracker.lelux.fi/announce
http://tracker.lelux.fi:80/announce
udp://tracker.edkj.club:6969/announce
http://tracker.pow7.com/announce
https://tracker.lelux.fi/announce
http://tracker.anirena.com/b16a15d9a238d1f59178d3614b857290/announce
https://cernet-tracker.appspot.com/announce
http://www.yqzuji.com/announce
http://tracker.publictorrent.net/announce
https://tracker.opentracker.se/announce
https://tracker.cyber-hub.net:443/announce
http://rstracker.ohys.net/announce
udp://aaa.army:8866/announce
http://aaa.army:8866/announce
http://hzzwly.gq:6969/announce
http://tracker.edkj.club:6969/announce
udp://tracker.lelux.fi:6969/announce
https://aaa.army:8866/announce
http://185.185.40.51:6969/announce
http://95.217.161.135/announce
http://tr.bangumi.moe/announce
http://tracker.pow7.com:80/announce
udp://tracker.4.babico.name.tr:3131/announce
https://t1.hloli.org/announce
https://inferno.demonoid.is/announce
http://75.127.14.224:2710/announce
http://seeders-paradise.org/announce
udp://buddyfly.top:6969/announce
udp://tracker.openbtba.com:6969/announce
udp://f1sh.de:6969/announce
udp://carr.codes:6969/announce
udp://bananas.space:6969/announce
udp://elementsbrowser.com:6969/announce
udp://mserver.link:6969/announce
udp://kokodayo.site:6969/announce
https://t1.hloli.org:443/announce
https://tracker.srv00.com:443/announce
udp://tracker3.itzmx.com:6961/announce
http://thetracker.org:80/announce
udp://admin.52ywp.com:6969/announce
http://mkfs.ru/announce
http://tracker.bittorrent.nibblepoker.lu:49227/announce
http://tracker.openbittorrrent.com:80/announce
http://51.68.122.172/announce
http://00.mercax.com:443/announce
http://tracker.files.fm:6969/announce
http://bt.ktkj.com:8080/announce
https://docker-tracker-production.up.railway.app/announce
https://carapax.net/announce
http://bt.edwardk.info:63124/announce
http://bt.edwardk.info:6767/announce
http://tracker.shuntv.net/announce.php
http://anidex.moe:6969/announce+
http://bt.edwardk.info:12891/announce
http://trackers.ibzu.me/announce.php
http://tracker.bt-hash.com/announce
http://tracker.moxing.party:6969/announce
http://tracker.istole.it/announce
http://tracker.filemail.com:6969/announce
http://bt.edwardk.info:676/announce
http://tracker.openzim.org/announce
https://tracker.moxing.party:6969/announce
udp://47.ip-51-68-199.eu:6969/announce
http://tracker.pimp4003.net/announce
http://peersteers.org/announce
http://ehtracker.org/1104308/announce
http://torrent-tracker.ru/announce.php
http://bt02.nnm-club.cc:2710/announce
https://grifon.info:80/announce
http://bt02.nnm-club.info:2710/announce
http://155.248.200.105/announce
http://180.97.219.76:8070/announce
udp://tr.cili001.com:8070/announce
http://tr.cili001.com:8070/announce
udp://thetracker.org:80/announce
http://tracker.zerobytes.xyz:1337/announce
udp://tracker.zerobytes.xyz:1337/announce
http://ftp.pet:6969/announce
http://i.bandito.org/announce.php
http://opentracker.acgnx.com:6869/announce
http://tracker.encrypted-data.xyz:1337/announce
http://ftp.pet:2710/announce
http://220.130.15.27:6969/announce
http://38.145.197.79:6961/announce
http://88.99.189.199:6969/announce
http://dn42.smrsh.net:6969/announce
http://uraniumhexafluori.de:1919/announce
http://171.104.110.95:6969/announce
http://99.192.12.191:6969/announce
http://151.115.49.115:1337/announce
https://tracker1.wimix.org/announce
http://00.xxtor.com:443/announce
https://tr.kxmp.cf:80/announce
http://tracker.novaopcj.eu.org:6969/announce
http://bithq.org:80/announce.php
http://13.115.115.32:6969/announce
http://61.216.149.33:6969/announce
http://61.222.178.227:6969/announce
http://tracker.fansub.id/announce
http://207.246.79.17:8080/announce
http://207.246.79.17:2710/announce
http://207.246.79.17:6961/announce
http://47.54.245.23:6969/announce
http://189.110.233.96:6969/announce
http://83.31.33.73:6969/announce
http://tracker.swateam.org.uk:2710/announce
http://tracker.coppersurfer.site:2710/announce
http://tracker3.torrentino.com/announce
http://tracker2.torrentino.com/announce
http://47.243.23.189:6969/announce
http://45.63.111.135:2710/announce
http://45.63.111.135:6961/announce
http://45.63.111.135:8080/announce
http://83.6.231.40:6969/announce
http://tracker.enitin.xyz/announce
https://tracker.logirl.moe:443/announce
https://bt.endpot.com/announce
http://504e163a.host.njalla.net:6969/announce
https://337hhh.xyz/announce
http://secure.pow7.com:80/announce
udp://10.rarbg.com/announce
udp://tracker.istole.it:80/announce
udp://11.rarbg.com:80/announce
http://tracker2.itzmx.com:6961/announce
udp://tracker2.itzmx.com:6961/announce
http://www.peckservers.com:9000/announce
http://201.43.209.254:6969/announce
http://p2p.0g.cx:6969/announce
http://45.154.253.8/announce
http://97.117.78.100:9000/announce
http://144.202.33.210:6961/announce
http://217.30.10.77:6969/announce
udp://pow7.com:80/announce
http://bz.tracker.bz/announce
https://chihaya-heroku.120181311.xyz/announce
https://chihaya-heroku.120181311.xyz:443/announce
http://bt.poletracker.org:2710/announce
http://107.189.10.20.sslip.io:7777/announce
http://116.9.207.164:6969/announce
http://97.117.128.139:9000/announce
http://157.90.169.123/announce
http://179.100.24.134:6969/announce
http://43.139.20.56:6969/announce
http://83.6.237.118:6969/announce
http://bz.tracker.bz:80/announce
http://bithq.org/announce.php
http://big-boss-tracker.net/announce.php
http://bt1.archive.org:6969/announce
http://bt2.archive.org:6969/announce
http://bt-tracker.gamexp.ru:2710/announce
http://tracker.servequake.com:9999/announce
http://tracker.openbittorrrent.com/announce
https://tracker.crawfish.cf/announce
http://97.117.102.248:9000/announce
http://207.246.118.100:6961/announce
http://83.6.208.20:6969/announce
http://171.104.226.221:6969/announce
udp://jutone.com:6969/announce
udp://free.publictracker.xyz:6969/announce
udp://freedom.1776.ga:6969/announce
udp://devops.gay:6969/announce
udp://dht.bt251.com:6969/announce
udp://aegir.sexy:6969/announce
udp://wepzone.net:6969/announce
udp://bedro.cloud:6969/announce
udp://static.54.161.216.95.clients.your-server.de:6969/announce
udp://94-227-232-84.access.telenet.be:6969/announce
udp://v1046920.hosted-by-vdsina.ru:6969/announce
udp://private.anonseed.com:6969/announce
udp://thagoat.rocks:6969/announce
udp://acxx.de:6969/announce
http://tracker.yoshi210.com:6969/announce
https://tracker.cangku.moe/announce
http://tracker.computel.fr/announce
https://tracker.cangku.moe:443/announce
http://tracker.computel.fr:80/announce
http://220.130.15.30:6969/announce
http://171.104.110.88:6969/announce
http://97.117.105.168:9000/announce
http://189.0.196.51:6969/announce
http://83.6.223.8:6969/announce
http://tracker.fdn.fr:6969/announce
https://tracker.skynetcloud.site:8443/announce
https://trackers.mlsub.net/announce
http://159.69.65.157:6969/announce
https://tracker.mlsub.net/announce
http://www.nartlof.com.br:6969/announce
http://61.222.178.254:6969/announce
http://211.22.29.93/announce
http://211.75.29.254:6969/announce
http://97.117.75.139:9000/announce
http://201.42.214.55:6969/announce
http://83.6.234.75:6969/announce
https://voxhost.fr:443/announce
http://171.104.110.21:6969/announce
https://tracker.pterclub.com/announce
http://tracker.btzero.net:8080/announce
wss://tracker.files.fm:7073/announce
https://trackers.mlsub.net:443/announce
https://tracker.mlsub.net:443/announce
http://bt1.letpo.com:80/announce
http://tracker.bz:80/announce
http://tracker.bz/announce
udp://tracker-udp.anirena.com:80/announce
udp://tracker-udp.gbitt.info:80/announce
http://bt1.letpo.com/announce
udp://mirror.aptus.co.tz:6969/announce
wss://tracker.openwebtorrent.com/announce
http://tracker.fansub.id:80/announce
http://97.117.145.39:9000/announce
http://83.6.227.65:6969/announce
http://116.9.207.121:6969/announce
http://tracker.xfapi.top:6868/announce
http://tracker.xfapi.top:9999/announce
http://tracker.xfapi.top:7070/announce
http://tracker.dm258.cn:7070/announce
udp://ipv4.tracker.harry.lu:80/announce
http://ipv4.tracker.harry.lu:80/announce
http://bigfoot1942.sektori.org:6969/announce
http://montreal.nyap2p.com:8080/announce
https://tracker.tvgc.win/announce
http://tracker.qu.ax:6969/announce
http://171.104.111.250:6969/announce
http://97.117.150.188:9000/announce
http://192.3.165.191:6969/announce
http://45.154.98.215:6969/announce
http://83.6.209.31:6969/announce
http://tracker.letpo.com/announce
http://171.104.111.83:6969/announce
http://163.172.29.130/announce
http://147job.com:6969/announce
http://83.31.216.220:6969/announce
http://alltorrents.net/bt:80/announce.php
http://mvgforumtracker.mvgroup.org/tracker.php:80/announce
http://5.78.67.213:6699/announce
http://tracker.baka-sub.cf:80/announce
http://mediaclub.tv:80/announce
http://proaudiotorrents.org:80/announce.php
http://peersteers.org:80/announce
https://zer0day.000webhostapp.com/announce
http://185.148.3.231:80/announce
http://alpha.torrenttracker.nl:443/announce
https://tracker.torrentsnows.com:443/announce
https://evening-badlands-6215.herokuapp.com/announce
http://milliontorrent.pl:80/announce.php
http://alltorrents.net:80/bt:80/announce.php
http://servandroidkino.ru/announce
http://finbytes.org:80/announce.php
wss://tracker.btorrent.xyz:443/announce
http://171.104.110.193:6969/announce
http://129.146.193.240:6699/announce
http://83.6.232.23:6969/announce
http://97.117.101.163:9000/announce
http://dht.dhtclub.com:666/announce
http://192.9.228.30:6699/announce
http://83.6.211.179:6969/announce
https://ttk.pp.ua/announce
https://hcbt.pp.ua/announce
http://tracker.shittyurl.org:80/announce
https://tracker.shittyurl.org:443/announce
https://tracker.shittyurl.org/announce
http://debuz.com:6969/announce
http://45.154.253.9/announce
http://185.232.169.109/announce
https://tracker.nitrix.me/announce
https://tracker.nitrix.me:443/announce
http://tracker.anirena.com/announce
http://tracker1.itzmx.com:8080/announce
http://83.6.226.63:6969/announce
http://trackers.ydns.eu:10036/announce
http://tracker.shittyurl.org/announce
https://voxhost.fr/announce
http://milliontorrent.pl/announce.php
http://tracker.baka-sub.cf/announce
udp://207.241.226.111:6969/announce
udp://207.241.231.226:6969/announce
udp://93.158.213.92:1337//announce
udp://185.181.60.67:80/announce
udp://tracker.yangxiaoguozi.cn:6969/announce
http://158.101.137.177:6969/announce
http://160.251.78.190:6969/announce
http://107.189.31.134:6969/announce
https://dev.tracker.cf-identity-wallet.metadata.dev.cf-deployments.org/announce
https://torrent-tracker.hama3.net/announce
https://dev.tracker.cf-identity-wallet.metadata.dev.cf-deployments.org:443/announce
http://116.9.207.198:6969/announce
http://83.6.220.156:6969/announce
http://opentracker.io/announce
http://web.open-tracker.cf:6969/announce
https://torrent-tracker.hama3.net:443/announce
http://bt.endpot.com:80/announce
udp://211.75.29.254:6969/announce
udp://tracker.zaluan.xyz:6969/announce
udp://93.158.213.92:1337/announce
udp://23.137.251.45:6969/announce
udp://tracker.qu.ax:6969/announce
udp://89.36.216.8:6969/announce
http://opentracker.io:80/announce
udp://185.181.60.155:80/announce
udp://tracker.bittor.pw:1337/announce
udp://thinking.duckdns.org:6969/announce
udp://tracker.cubonegro.xyz:6969/announce
udp://stargrave.org:6969/announce
udp://156.234.201.18:80/announce
udp://185.44.82.25:1337/announce
http://171.104.226.87:6969/announce
http://45.154.253.6:80/announce
udp://52.58.128.163:6969/announce
udp://tracker.ololosh.space:6969/announce
udp://http://www.peckservers.com:9000/announce
udp://ipv4.tracker.harry.lu/announce
udp://open.stealth.si/announce
udp://ipv6.tracker.harry.lu/announce
http://1337.abcvg.info/announce+108
udp://bt.letpo.com:6969/announce
http://0123456789nonexistent.com/announce
http://ehtracker.org/1113709/announce
http://ehtracker.org/1226599/1080494xo5eXcwFOBq/announce
udp://cpe-104-34-3-152.socal.res.rr.com:6969/announce
http://171.104.111.89:6969/announce
http://cloud.nyap2p.com:8080/announce
http://tracker.swifte.space:2710/announce
http://116.9.207.226:6969/announce
http://62.182.85.138:666/announce
http://83.31.212.134:6969/announce
http://tracker.tfile.co/announce
http://tracker.tfile.co:80/announce
udp://tracker.ilibr.org:80/announce
http://52.70.94.249/announce
https://tr.doogh.club/announce
https://tr.highstar.shop/announce
https://tr.doogh.club:443/announce
https://tr.highstar.shop:443/announce
udp://www.peckservers.com:9000/announce
http://140.82.21.192:8080/announce
http://tracker.renfei.net:8080/announce
http://83.31.190.19:6969/announce
http://45.154.253.10/announce
http://171.104.111.201:6969/announce
http://83.31.211.243:6969/announce
udp://torrentclub.space:6969/announce
https://nyaa.tracker.wf:7777/announce
http://rotracker.ohys.net:80/announce
http://ehtracker.org/1/announce
http://171.104.111.14:6969/announce
http://83.31.209.3:6969/announce
https://tracker.renfei.net:443/announce
http://104.244.77.14:1337/announce
http://thetracker.org/announce
http://83.31.199.157:6969/announce
http://tracker.nyacat.pw:7000/announce.php
http://www.siambt.com/announce.php
http://60-fps.org:80/bt/announce.php
http://xtremewrestlingtorrents.net:80/announce.php
http://bt.beatrice-raws.org:80/announce
http://tracker.trancetraffic.com:80/announce.php
http://mixfiend.com:80/announce.php
http://163.172.29.130:80/announce
http://alltorrents.net:80/bt/announce.php
http://announce.partis.si:80/announce
http://mvgforumtracker.mvgroup.org:80/tracker.php/announce
http://156.234.201.18:80/announce
https://t.zerg.pw/announce
http://frp.v2fy.com:8000/announce
https://tracker.renfei.net/announce
http://rotracker.ohys.net/announce
udp://198.100.149.66:6969/announce
udp://109.201.134.183:80/announce
udp://178.170.48.154:1337/announce
http://185.197.195.20:1919/announce
http://83.31.191.97:6969/announce
http://45.154.253.4:80/announce
http://171.104.226.15:6969/announce
http://83.31.219.73:6969/announce
udp://ln.mtahost.co:6969/announce
http://tracker.aibt.xyz:900/announce
http://171.104.226.31:6969/announce
http://97.117.85.73:9000/announce
http://www.bit-hdtv.com:2710/announce
https://tk.mabo.ltd:443/announce
udp://172.105.235.127:6969/announce
udp://119.28.71.45:8080/announce
udp://103.122.21.50:6969/announce
udp://173.249.201.201:6969/announce
udp://104.131.98.232:6969/announce
udp://209.126.11.233:6969/announce
udp://192.95.46.115:6969/announce
udp://167.99.185.219:6969/announce
udp://51.15.3.74:6969/announce
udp://51.15.26.25:6969/announce
udp://51.158.144.42:6969/announce
udp://144.91.88.22:6969/announce
udp://51.159.54.68:6666/announce
udp://163.172.29.130:80/announce
udp://88.99.2.212:6969/announce
udp://148.251.53.72:6969/announce
udp://193.37.214.12:6969/announce
udp://82.65.115.10:6969/announce
udp://37.187.111.136:6969/announce
udp://176.31.250.174:6969/announce
udp://5.196.89.204:6969/announce
udp://5.196.67.51:6969/announce
udp://37.59.48.81:6969/announce
udp://37.187.95.112:6969/announce
udp://161.97.67.210:6969/announce
udp://185.102.219.163:6969/announce
udp://95.216.74.39:6969/announce
udp://135.125.106.92:6969/announce
udp://217.30.10.77:6969/announce
udp://93.104.214.40:6969/announce
udp://51.68.174.87:6969/announce
udp://45.9.60.30:6969/announce
udp://158.101.161.60:3131/announce
udp://opentracker.io:6969/announce
udp://94.103.87.87:6969/announce
udp://94.243.222.100:6969/announce
udp://91.211.5.21:6969/announce
udp://88.80.28.7:6969/announce
udp://194.38.21.77:6969/announce
udp://95.31.11.224:6969/announce
udp://46.138.242.240:6969/announce
udp://retracker01-msk-virt.corbina.net:80/announce
http://171.104.111.20:6969/announce
http://97.117.114.88:9000/announce
udp://51.81.222.188:6969/announce
udp://tracker.ccp.ovh:6969/announce
http://tr.nyacat.pw/announce
http://tracker.btcake.com/announce
https://tr.nyacat.pw/announce
http://tracker.btcake.com:80/announce
http://tracker.peckservers.com:9000/announce
http://www.ansktracker.net/announce.php?passkey=58fff4518e745565986d5d2d3e884841
https://tracker.bangumi.zip/announce
https://tracker.ipfsscan.io/announce
http://shogiroom.com:6969/announce
udp://107.175.221.194:6969/announce
http://www.bitseduce.com/announce.php
http://houniao.ddns.net:8888/announce
udp://open.publictracker.xyz:6969/announce
https://tracker.ipfsscan.io:443/announce
https://t.zerg.pw:443/announce
http://thitgaluoc.dynu.net:6969/announce
http://smurfsoft.com:6969/announce
http://region.nl1.privex.cc:6969/announce
http://canardscitrons.nohost.me:6969/announce
http://t.publictracker.xyz:6969/announce
http://li2021-95.members.linode.com:6969/announce
http://mail.lakameraobscura.com:6969/announce
http://unknownsite.de:6969/announce
http://wg.mortis.me:6969/announce
http://ch3oh.ru:6969/announce
http://www.chouchou.club:8080/announce
udp://t.zerg.pw:6969/announce
udp://ryjer.com:6969/announce
https://www.peckservers.com:9443/announce
http://49.12.76.8:8080/announce
http://ipv4.tracker.harry.lu/announce
https://tr.torland.ga/announce
https://tr.torland.ga:443/announce
https://tk.mabo.ltd/announce
http://tk2.greedland.net/announce
http://tracker.bt-chat.com/announce
http://torrents.linuxmint.com:80/announce.php
http://www.megatorrents.kg:80/announce.php
http://torrent.unix-ag.uni-kl.de:80/announce
udp://185.230.4.150:1337/announce
http://185.230.4.150:1337/announce
http://ehtracker.org/2496841/announce
http://home.kray.pw:6969/announce
udp://p4p.arenabg.com:1337/announce
http://p4p.arenabg.com:1337/announce
https://tracker.cloudit.top/announce
http://45.154.253.10:80/announce
http://shubt.net:2710/announce
http://tracker.ex.ua/announce
udp://tracker.ex.ua:80/announce
http://tracker.ex.ua:80/announce
https://k3tracker.cc/announce/0b0b5b2bb71770aa0df56f80a4863f07
udp://ns1.monolithindustries.com:6969/announce
udp://open.u-p.pw:6969/announce
udp://mail.segso.net:6969/announce
udp://market-re.quest:6969/announce
udp://6.pocketnet.app:6969/announce
https://tracker.cloudit.top:443/announce
udp://tk1.trackerservers.com:8080/announce
udp://oh.fuuuuuck.com:6969/announce
udp://tracker.farted.net:6969/announce
udp://public-tracker.cf:6969/announce
udp://su-data.com:6969/announce
udp://1c.premierzal.ru:6969/announce
udp://ssb14.nohost.me:6969/announce
udp://yahor.of.by:6969/announce
https://tracker.bangumi.zip:443/announce
http://45.67.35.111:6969/announce
http://46.231.241.43:6969/announce
https://tracker.kitaujisub.site/announce.php?authkey=213|10003|j46n2q
https://tracker.kitaujisub.site/announce.php?authkey=215|10003|j46n2q
http://185.130.47.2:6969/announce
http://tracker.yuelili.com:80/announce
http://anisource.spb.ru/announce
wss://spacetradersapi-chatbox.herokuapp.com:443/announce
http://ehtracker.org/2566145/1159106xUfsJkT9Btg/announce
http://tracker.yuelili.com/announce
https://tracker.bt4g.com:443/announce
http://ehtracker.org/2541477/announce
https://tracker.kawaii.id/announce
http://tracker.sheesh.rip:6969/announce
http://open.8a.is:6969/announce
http://ftp.pet:999/announce
https://tracker.monikadesign.uk/announce/63ea34cb9815cd28d63fc75b2f2c5a56
http://79.137.198.96:6969/announce
http://tracker.nartlof.com.br:6969/announce
http://65.130.205.148:9000/announce
http://49.12.76.8:6961/announce
http://91.224.92.110:6969/announce
http://www.arabp2p.net:2052/f5a1e35785c9f3885fd54f34b6e262b8/announce
http://107.189.7.143:6969/announce
http://tracker.gdp.pw:900/announce
http://reisub.nsupdate.info:6969/announce
http://tracker.vanitycore.co:6969/announce
https://tracker.bt4g.com/announce
http://tracker.pcfreetime.com:6969/announce
http://cn.pcfreetime.com:6969/announce
http://tracker.ccc.de/announce
http://rfc5746.mywaifu.best:6969/announce
https://tracker.monikadesign.uk/announce/a46be21ab845cc0d534d06fea801f95a
http://www.shnflac.net/announce.php
udp://tracker.btsync.gq:233/announce
https://tracker.h3o2.me:443/announce
http://tracker.netmap.top:6969/announce
https://k.avc.cx:443/announce.php
http://torrent.nwps.ws:80/announce
http://bt.dl1234.com/announce
http://www.biztorrents.com/announce.php
https://bt.080609.xyz:443/announce
http://bvarf.tracker.sh:2086/announce
https://bt.080609.xyz/announce
http://46.17.46.112:8080/announce
http://lima-peru.subventas.com:443/announce
http://tracker.sbsub.com:2710/announce
https://tracker.vectahosting.eu/announce
http://torrent.nwps.ws/announce
https://k.avc.cx/announce.php
https://tracker.netmap.top:8443/announce
https://bt.nfshost.com/announce
http://kamikazee.duckdns.org:7777/announce
https://tracker.yemekyedim.com:443/announce
http://tracker1.torrentino.com/announce
http://bobbialbano.com:6969/announce
http://[2001:1b10:1000:8101:0:242:ac11:2]:6969/announce
http://[2a00:b700:1::3:1dc]:8080/announce
http://[2a01:4f8:c012:8025::1]:8080/announce
http://[2a04:ac00:1:3dd8::1:2710]:2710/announce
http://retracker.hotplug.ru:2710/announce
http://tracker.birkenwald.de:6969/announce
http://tracker.ipv6tracker.ru:80/announce
http://tracker.k.vu:6969/announce
http://tracker.rev.pm:6969/announce
http://v6-tracker.0g.cx:6969/announce
udp://184.105.151.166:6969/announce
udp://46.17.46.112:8080/announce
udp://49.12.76.8:8080/announce
udp://91.216.110.52:451/announce
udp://[2001:1b10:1000:8101:0:242:ac11:2]:6969/announce
udp://[2001:470:1:189:0:1:2:3]:6969/announce
udp://[2a00:b700:1::3:1dc]:8080/announce
udp://[2a01:4f8:c012:8025::1]:8080/announce
udp://[2a03:7220:8083:cd00::1]:451/announce
udp://[2a04:ac00:1:3dd8::1:2710]:2710/announce
udp://[2a0f:e586:f:f::81]:6969/announce
udp://aarsen.me:6969/announce
udp://d40969.acod.regrucolo.ru:6969/announce
udp://ec2-18-191-163-220.us-east-2.compute.amazonaws.com:6969/announce
udp://evan.im:6969/announce
udp://exodus.desync.com:6969/announce
udp://hz.is:1337/announce
udp://ipv6.fuuuuuck.com:6969/announce
udp://isk.richardsw.club:6969/announce
udp://odd-hd.fr:6969/announce
udp://open.dstud.io:6969/announce
udp://opentor.org:2710/announce
udp://retracker.hotplug.ru:2710/announce
udp://sabross.xyz:6969/announce
udp://tracker.0x7c0.com:6969/announce
udp://tracker.6.babico.name.tr:6969/announce
udp://tracker.anima.nz:6969/announce
udp://tracker.birkenwald.de:6969/announce
udp://tracker.cubonegro.lol:6969/announce
udp://tracker.cyberia.is:6969/announce
udp://tracker.dump.cl:6969/announce
udp://tracker.fnix.net:6969/announce
udp://tracker.iperson.xyz:6969/announce
udp://tracker.moeking.me:6969/announce
udp://tracker.openbittorrent.com:6969/announce
udp://tracker.skynetcloud.site:6969/announce
udp://tracker.t-rb.org:6969/announce
udp://tracker.theoks.net:6969/announce
udp://tracker.therarbg.com:6969/announce
udp://tracker.torrent.eu.org:451/announce
udp://tracker.tryhackx.org:6969/announce
udp://tracker1.myporn.club:9337/announce
udp://ttk2.nbaonlineservice.com:6969/announce
udp://u4.trakx.crim.ist:1337/announce
udp://u6.trakx.crim.ist:1337/announce
udp://www.2600.com:6969/announce
udp://x.paranoid.agency:6969/announce
udp://x.t-1.org:6969/announce
udp://y.paranoid.agency:6969/announce
udp://9.rarbg.me:2770/announce
http://tracker.kamigami.org:2710/announce
http://mgtracker.org:6969/announce
udp://shadowshq.eddie4.nl:6969/announce
udp://tracker.leechers-paradise.org:6969
udp://9.rarbg.to:2710/announce
udp://shadowshq.yi.org:6969/announce
udp://tracker.pirateparty.gr:6969/announce
udp://9.rarbg.com:2710/announce
udp://tracker.vanitycore.co:6969/announce
udp://zephir.monocul.us:6969/announce
udp://tracker.cypherpunks.ru:6969/announce
udp://z.crazyhd.com:2710/announce
udp://tracker.qt.is:6969/announce
udp://denis.stalker.upeer.me:6969/announce
udp://tracker.open-internet.nl:6969/announce
udp://torr.ws:2710/announce
http://retracker.spb.ru:80/announce
udp://tracker.ds.is:6969/announce
udp://tracker.0o.is:6969/announce
udp://tracker.port443.xyz:6969/announce
udp://open.demonii.si:1337/announce
udp://tracker.uw0.xyz:6969/announce
udp://peerfect.org:6969/announce
http://retracker.telecom.by:80/announce
udp://bt.xxx-tracker.com:2710/announce
udp://tracker.doko.moe:6969/announce
http://retracker.mgts.by:80/announce
udp://inferno.demonoid.pw:3418/announce
udp://public.popcorn-tracker.org:6969/announce
udp://www.eddie4.nl:6969/announce
udp://inferno.demonoid.ooo:3389/announce
udp://62.138.0.158:6969/announce
http://retracker.mgts.by/announce
udp://tracker.coppersurfer.tk:6969/announce
http://tracker.mg64.net:6881/announce
http://173.254.204.71:1096/announce
udp://eddie4.nl:6969/announce
udp://tracker.acg.gg:2710/announce
http://tracker.acg.gg:2710/announce
http://tracker.acg.gg:1578/announce
http://torrentsmd.eu:8080/announce
http://mgtracker.org:2710/announce
udp://9.rarbg.com:2790/announce
udp://9.rarbg.me:2710/announce
udp://9.rarbg.com:2730/announce
http://tracker.city9x.com:2710/announce
udp://tracker.leechers-paradise.org:6969/announce
udp://explodie.org:6969/announce
http://torrentsmd.me:8080/announce
http://tracker.city9x.com:2710/scrape
udp://tracker.publicbt.com:80/announce
http://tracker.prq.to/announce.php
http://tracker.prq.to/announce
http://tracker.thepiratebay.org/announce
http://tv.tracker.prq.to/announce
http://tracker.bitebbs.com:6969/announce
http://tracker.ydy.com:87/announce
http://btfans.3322.org:6969/announce
http://btfans.3322.org:8080/announce
http://btfans.3322.org:8000/announce
http://tracker.torrent.to:2710/announce
http://publictracker.org/announce.php
http://gamebt.ali213.net:8000/announce
http://inferno.demonoid.com:3413/announce
http://denis.stalker.h3q.com:6969/announce
http://open.tracker.thepiratebay.org/announce
http://tpb.tracker.thepiratebay.org/announce
http://ezard.ma.cx:6969/announce
http://torrentz.ofgods.com:2710/announce
http://bt-dbfr.shonencenter.net:8000/announce
http://tracker9.bol.bg/announce.php
http://tracker.piecesnbits.net:2710/announce
http://tracker.paradise-tracker.com:9999/announce
http://unme.findhere.org:2710/announce
http://kende.9999mb.com/announce.php
udp://denis.stalker.h3q.com:6969/announce
udp://bt.romman.net:6969/announce
udp://www.lamsoft.net:6969/announce
udp://bt1.btally.net:6969/announce
udp://tracker.lamsoft.net:6969/announce
udp://bt1.511yly.com:6969/announce
udp://bt1.125a.net:6969/announce
http://a.tracker.thepiratebay.org/announce
http://a.tracker.thepiratebay.org/announce.php
http://tpb.tracker.thepiratebay.org/announce.php
http://open.tracker.thepiratebay.org/announce.php
http://denis.stalker.h3q.com:6969/announce.php
http://eztv.tracker.thepiratebay.org/announce
http://eztv.tracker.thepiratebay.org/announce.php
http://vip.tracker.thepiratebay.org/announce
http://vip.tracker.thepiratebay.org/announce.php
http://tv.tracker.prq.to/announce.php
http://tracker.thepiratebay.org/announce.php
http://tracker1.torrentum.pl:6969/announce
http://tracker1.torrentum.pl:6969/announce.php
http://tracker.publicbt.com/announce
http://torrent-download.to:5869/announce
http://10.rarbg.com/announce
udp://tracker.1337x.org:80/announce
http://exodus.desync.com:6969/announce
udp://tracker.ccc.de:80
http://inferno.demonoid.me:3419/announce
udp://tracker.istole.it:80
http://fr33dom.h33t.com:3310/announce
udp://10.rarbg.com:80/announce
udp://tracker.openbittorrent.com:80
udp://tracker.publicbt.com:80
udp://tracker.istole.it:6969
http://announce.torrentsmd.com:6969/announce
http://announce.torrentsmd.com:8080/announce
http://i.bandito.org/announce
http://www.h33t.com:3310/announce
http://tracker.torrentbay.to:6969/announce
udp://denis.stalker.h3q.com:6969/announce.php
http://i-p-v-6.tk:6969/announce
http://open-v6.demonoid.ch:6969/announce
https://tracker1.wimix.org:443/announce
udp://9.rarbg.com:2810/announce
udp://[2a0f:e586:f:f::220]:6969/announce
udp://creative.7o7.cx:6969/announce
udp://cutiegirl.ru:6969/announce
udp://ftp.pet:2710/announce
udp://ipv6.tracker.harry.lu:80/announce
udp://ipv6.tracker.monitorit4.me:6969/announce
udp://tracker.altrosky.nl:6969/announce
udp://tracker.beeimg.com:6969/announce
udp://tracker.encrypted-data.xyz:1337/announce
udp://tracker.jonaslsa.com:6969/announce
udp://tracker.joybomb.tw:6969/announce
udp://tracker.leech.ie:1337/announce
udp://tracker.pimpmyworld.to:6969/announce
udp://tracker6.lelux.fi:6969/announce
udp://www.torrent.eu.org:451/announce
udp://xxx.xxtor.com:3074/announce
ws://hub.bugout.link:80/announce
udp://madiator.com:6969/announce
udp://open6.demonii.com:1337/announce
udp://static.202.35.76.144.clients.your-server.de:6969/announce
udp://tracker.lyretain.site:2710/announce
udp://tracker.wellknownclub.net:8100/announce
udp://tracker.breizh.pm:6969/announce
udp://tracker.teambelgium.net:6969/announce
udp://204.79.238.89.in-addr.arpa.manitu.net:6969/announce
http://thebytestore.co.uk:6969/announce
udp://jeremylee.sh:6969/announce
udp://tracker.tallpenguin.org:15730/announce
udp://8.rarbg.com:2710/announce
udp://7.rarbg.to:2710/announce
udp://sugoi.pomf.se:80/announce
udp://82.156.24.219:6969/announce
http://112.251.209.62:6969/announce
http://bt.3dmgame.com:2710/announce
http://torrents-nn.cn:2710/announce
udp://193.189.100.186:6969/announce
wss://tracker.webtorrent.dev
udp://5.102.159.190:6969/announce
udp://91.216.110.53:451/announce
udp://116.202.49.58:6969/announce
udp://23.134.88.6:1337/announce
udp://51.15.41.46:6969/announce
udp://51.15.79.209:6969/announce
udp://80.240.22.46:6969/announce
http://bt2.54new.com:8080/announce
http://34.94.213.23:80/announce
udp://102.223.180.235:6969/announce
udp://23.153.248.2:6969/announce
udp://tracker.tricitytorrents.com:2710/announce
wss://peertube.cpy.re:443/tracker/socket
udp://37.27.4.53:6969/announce
udp://45.152.84.245:6969/announce
http://bt.unionpeer.org:777/announce
udp://tracker.btsync.gq:2710/announce
udp://tracker-de.ololosh.space:6969/announce
udp://y.t-1.org:6969/announce
udp://185.189.13.108:6969/announce
udp://45.95.232.15:6969/announce
udp://208.83.20.20:6969/announce
udp://tracker.coppersurfer.tk:80/announce
udp://209.141.59.16:6969/announce
http://freerainbowtables.com:6969/announce
http://www.freerainbowtables.com:6969/announce
udp://209.141.56.75:6969/announce
http://hdreactor.org:2710/announce
http://torrent.resonatingmedia.com:6969/announce
udp://denis.stalker.upeer.me:1337/announce
http://tracker.tasvideos.org:6969/announce
http://216.250.247.140:1096/announce
udp://23.254.228.89:6969/announce
udp://216.201.9.155:6969/announce
http://bt.hliang.com:2710/announce
udp://107.189.5.254:6969/announce
udp://35.227.12.84:1337/announce
udp://179.43.155.30:6969/announce
http://www.thevault.bz:2810/announce
udp://104.244.77.87:6969/announce
udp://openbittorrent.com:80/announce
udp://37.221.67.6:6969/announce
udp://185.243.218.213:80/announce
http://xbtrutor.com:2710/announce
http://www.thegeeks.bz:3210/announce
http://tehconnection.eu:2790/announce
http://tracker.theempire.bz:3110/announce
udp://193.42.111.57:9337/announce
udp://185.217.199.21:6969/announce
udp://62.233.57.13:6969/announce
http://tracker.webcdn.top:6969/announce
https://tracker.webcdn.top:8443/announce
udp://38.7.201.142:6969/announce
udp://152.231.114.33:1337/announce
udp://159.65.224.91:6969/announce
udp://83.102.180.21:80/announce`;

function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);    
  }

function copyTrackers(){
    copyToClipboard(textToCopy);
    var obj = document.getElementById('copytrackers');
    obj.innerHTML = "√ 已复制";
    obj.style.backgroundColor = "#daf2c2";
    obj.style.color = "#397300";
    setTimeout(function () {
        obj.innerHTML = '复制Trackers';
        obj.style.backgroundColor = "#f2f2f2";
        obj.style.color = "#000000";
    }, 3000);
}
setInterval("refresh()", 1000);
