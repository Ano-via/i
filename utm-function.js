function openLinkInNewTab() {
    var link = document.getElementById('websiteurl').value;
    if (link.trim() !== '') {
        window.open(link, '_blank');
    } else {
        alert('请输入链接');
    }
}
function openLinkInNewTab2() {
    var link = document.getElementById('utmresult').value;
    if (link.trim() !== '') {
        window.open(link, '_blank');
    } else {
        alert('请输入链接');
    }
}
function openShortenendUrl() {
    var link = document.getElementById('shortenedurl').value;
    if (link.trim() !== '') {
        window.open(link, '_blank');
    } else {
        alert('请输入链接');
    }
}
function showPopup(temp1) {
    document.getElementById("popup").style.display = "block";
    document.getElementById("temp1").value = temp1;
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function insertField(field) {
    const inputField = document.getElementById("temp1").value;
    const textField = document.getElementById(inputField);
    textField.value = field;
    closePopup();
}
function copyutmresult() {
    var copyText = document.getElementById("utmresult");
    copyText.select();
    copyText.setSelectionRange(0, 999);
    document.execCommand("copy");
    document.getElementById("copybefore").innerHTML = "√ 已复制";
    var obj = document.getElementById('copybefore');
    obj.style.backgroundColor = "#daf2c2";
    obj.style.color = "#397300";
    setTimeout(function () {
        obj.innerHTML = "复制上面";
        obj.style.backgroundColor = "#f2f2f2";
        obj.style.color = "#000000";
    }, 3000);
}
function shortenurl() {
    const accessToken = '13ff8fc9c4983636f414ad6ca51b7acf6cb2d857';
    const longUrl = document.getElementById("utmresult").value;
    const apiUrl = 'https://api-ssl.bitly.com/v4/shorten';
    document.getElementById("shortenurl").innerHTML = "生成中";
    document.getElementById("shortenedurl").value = "";
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            long_url: longUrl,
        }),
    })
        .then(response => response.json())
        .then(data => {
            const shortUrl = data.link;
            console.log(`Bitly短链接：${shortUrl}`);
            document.getElementById("shortenedurl").value = shortUrl;
            var copyText = document.getElementById("shortenedurl");
            copyText.select();
            copyText.setSelectionRange(0, 999);
            document.execCommand("copy");
            document.getElementById("shortenurl").innerHTML = "√ 已复制";
            var obj = document.getElementById('shortenurl');
            obj.style.backgroundColor = "#daf2c2";
            obj.style.color = "#397300";
            setTimeout(function () {
                obj.innerHTML = '<img src="https://d1ayxb9ooonjts.cloudfront.net/0482a3c938673192a591f2845b9eb275.png" height="22">&nbsp;短链&nbsp;';
                obj.style.backgroundColor = "#f2f2f2";
                obj.style.color = "#000000";
            }, 3000);
        })
        .catch(error => {
            console.error('生成Bitly短链接时发生错误:', error);
            document.getElementById("shortenurl").innerHTML = '<img src="https://d1ayxb9ooonjts.cloudfront.net/0482a3c938673192a591f2845b9eb275.png" height="22">&nbsp;短链&nbsp;';
        });
}
function tinyurl() {
    const apiToken = 'PC7gbIfGAUctHLmuVcJYfqzMuUthyotURHhvxpz8QnZ5t9UTkrZcK48TC2Ru';
    const apiUrl = 'https://api.tinyurl.com/create';
    const longUrl = document.getElementById("utmresult").value;
    const headers = {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
    };
    const requestBody = {
        "url": longUrl
    };
    document.getElementById("tinyurl").innerHTML = "生成中";
    document.getElementById("shortenedurl").value = "";
    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                console.log('TinyURL短链接：', data.data.tiny_url);
                const shortUrl = data.data.tiny_url;
                document.getElementById("shortenedurl").value = shortUrl;
                var copyText = document.getElementById("shortenedurl");
                copyText.select();
                copyText.setSelectionRange(0, 999);
                document.execCommand("copy");
                document.getElementById("tinyurl").innerHTML = "√ 已复制";
                var obj = document.getElementById('tinyurl');
                obj.style.backgroundColor = "#daf2c2";
                obj.style.color = "#397300";
                setTimeout(function () {
                    obj.innerHTML = '<img src="https://tinyurl.com/images/icons/favicon-32.png" height="22">';
                    obj.style.backgroundColor = "#f2f2f2";
                    obj.style.color = "#000000";
                }, 3000);
            } else {
                console.error('生成Tinyurl短链接时发生错误:', data.errors.join(', '));
                document.getElementById("tinyurl").innerHTML = '<img src="https://tinyurl.com/images/icons/favicon-32.png" height="22">';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("tinyurl").innerHTML = '<img src="https://tinyurl.com/images/icons/favicon-32.png" height="22">';
        });
}

function reurl() {
    const apiKey = '4070ff49d794e63018503b663c974755ecd6b637939a04df8a38b58d65165567c4f5d6';
    const apiUrl = 'https://api.reurl.cc/shorten';
    const longUrl = document.getElementById("utmresult").value;

    const headers = {
        'Content-Type': 'application/json',
        'reurl-api-key': apiKey,
    };

    const requestBody = {
        "url": longUrl
    };

    document.getElementById("shortenedurl").value = "";
    document.getElementById("reurl").innerHTML = "生成中";

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
    })
        .then(response => response.json())
        .then(data => {
            if (data.res === "success") {
                console.log('Shortened URL:', data.short_url);
                const shortUrl = data.short_url;
                document.getElementById("shortenedurl").value = shortUrl;

                var copyText = document.getElementById("shortenedurl");
                copyText.select();
                copyText.setSelectionRange(0, 999);
                document.execCommand("copy");

                document.getElementById("reurl").innerHTML = "√ 已复制";
                var obj = document.getElementById('reurl');
                obj.style.backgroundColor = "#daf2c2";
                obj.style.color = "#397300";

                setTimeout(function () {
                    obj.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByklEQVR4AX2RM3gmUQBFb2zbts1mbTdr27ZtM7adlMtmzWZtb72qksl93/9m4hRnfM48QFEUBPj7azhZWCFx0kSgohpB2VkIzM6+SBTyiwwiUBFuj4CHoxOi0lKBsnIE5uamSfkPaZPXo/oKuJByctzF0hpJG9cD5RWjOQohzSV2MvCir8BDogQEBCgu1rbXIpOTgJLSgf55eULaJKUPMmLYPbCYKOQ8OaGL2JxM3rkjDsUlQlhIIOWfvY3goAysJPD3829xs3f4mLJl8zCOQkjPyDcZWNRbYLQMvNUF/Ay4mIXJ27dNkQGV1f3tQraMtHIEiruD452UrVvUEVwMyZFiPwHBBvI/kGtgb2K2iYE0GdjAwGjiRCDpNYCgoCA4mlkgMiEeJkXFo7zz80RgFoVG8rnfgJDd7Ozh5eyC4HNngdKyUcFZWSIwlcIyopBbPQJerm7wdneHnYkpPBwcEbdnF1BRhZCsrFFy8TZIqU5GbhB9LRAcGgp/jiA6NQXRx44KGfwzKKqB7QQyUi8jB7RABIcbdfYsDIqKxbBVWTCme0DyglzWAo6FRbAvKoJnfj6CdKJKpgzsIOgUMRdoAb7oj2fkQLeAtojtiSOToai1IMsAAAAASUVORK5CYII=" height="22">';
                    obj.style.backgroundColor = "#f2f2f2";
                    obj.style.color = "#000000";
                }, 3000);
            } else {
                console.error('Error:', data.msg);
                document.getElementById("reurl").innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByklEQVR4AX2RM3gmUQBFb2zbts1mbTdr27ZtM7adlMtmzWZtb72qksl93/9m4hRnfM48QFEUBPj7azhZWCFx0kSgohpB2VkIzM6+SBTyiwwiUBFuj4CHoxOi0lKBsnIE5uamSfkPaZPXo/oKuJByctzF0hpJG9cD5RWjOQohzSV2MvCir8BDogQEBCgu1rbXIpOTgJLSgf55eULaJKUPMmLYPbCYKOQ8OaGL2JxM3rkjDsUlQlhIIOWfvY3goAysJPD3829xs3f4mLJl8zCOQkjPyDcZWNRbYLQMvNUF/Ay4mIXJ27dNkQGV1f3tQraMtHIEiruD452UrVvUEVwMyZFiPwHBBvI/kGtgb2K2iYE0GdjAwGjiRCDpNYCgoCA4mlkgMiEeJkXFo7zz80RgFoVG8rnfgJDd7Ozh5eyC4HNngdKyUcFZWSIwlcIyopBbPQJerm7wdneHnYkpPBwcEbdnF1BRhZCsrFFy8TZIqU5GbhB9LRAcGgp/jiA6NQXRx44KGfwzKKqB7QQyUi8jB7RABIcbdfYsDIqKxbBVWTCme0DyglzWAo6FRbAvKoJnfj6CdKJKpgzsIOgUMRdoAb7oj2fkQLeAtojtiSOToai1IMsAAAAASUVORK5CYII=" height="22">';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("reurl").innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByklEQVR4AX2RM3gmUQBFb2zbts1mbTdr27ZtM7adlMtmzWZtb72qksl93/9m4hRnfM48QFEUBPj7azhZWCFx0kSgohpB2VkIzM6+SBTyiwwiUBFuj4CHoxOi0lKBsnIE5uamSfkPaZPXo/oKuJByctzF0hpJG9cD5RWjOQohzSV2MvCir8BDogQEBCgu1rbXIpOTgJLSgf55eULaJKUPMmLYPbCYKOQ8OaGL2JxM3rkjDsUlQlhIIOWfvY3goAysJPD3829xs3f4mLJl8zCOQkjPyDcZWNRbYLQMvNUF/Ay4mIXJ27dNkQGV1f3tQraMtHIEiruD452UrVvUEVwMyZFiPwHBBvI/kGtgb2K2iYE0GdjAwGjiRCDpNYCgoCA4mlkgMiEeJkXFo7zz80RgFoVG8rnfgJDd7Ozh5eyC4HNngdKyUcFZWSIwlcIyopBbPQJerm7wdneHnYkpPBwcEbdnF1BRhZCsrFFy8TZIqU5GbhB9LRAcGgp/jiA6NQXRx44KGfwzKKqB7QQyUi8jB7RABIcbdfYsDIqKxbBVWTCme0DyglzWAo6FRbAvKoJnfj6CdKJKpgzsIOgUMRdoAb7oj2fkQLeAtojtiSOToai1IMsAAAAASUVORK5CYII=" height="22">';
        });
}


function isgd() {
    const apiUrl = 'https://is.gd/create.php';
    const longUrl = encodeURIComponent(document.getElementById("utmresult").value);

    const requestUrl = `${apiUrl}?format=json&url=${longUrl}`;

    document.getElementById("shortenedurl").value = "";
    document.getElementById("isgd").innerHTML = "生成中";

    fetch(requestUrl, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (data.shorturl) {
                console.log('Shortened URL:', data.shorturl);
                const shortUrl = data.shorturl;
                document.getElementById("shortenedurl").value = shortUrl;

                var copyText = document.getElementById("shortenedurl");
                copyText.select();
                copyText.setSelectionRange(0, 999);
                document.execCommand("copy");

                document.getElementById("isgd").innerHTML = "√ 已复制";
                var obj = document.getElementById('isgd');
                obj.style.backgroundColor = "#daf2c2";
                obj.style.color = "#397300";

                setTimeout(function () {
                    obj.innerHTML = '<img src="https://is.gd/isgd_favicon.ico" height="22">';
                    obj.style.backgroundColor = "#f2f2f2";
                    obj.style.color = "#000000";
                }, 3000);
            } else {
                console.error('Error:', data.errormessage);
                document.getElementById("isgd").innerHTML = '<img src="https://is.gd/isgd_favicon.ico" height="22">';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("isgd").innerHTML = '<img src="https://is.gd/isgd_favicon.ico" height="22">';
        });
}

function shrtlnk() {
    const apiKey = 'jd8NAtHZ6RM4k6fZxWSNgIkzmhnfPlBdQa9jV31OiLsCk';
    const apiUrl = 'https://shrtlnk.dev/api/v2/link';
    const longUrl = document.getElementById("utmresult").value;

    const headers = {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        'Accept': 'application/json'
    };

    const requestBody = {
        "url": longUrl
    };

    document.getElementById("shortenedurl").value = "";
    document.getElementById("shrtlnk").innerHTML = "生成中";

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
    })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            if (status === 201) {
                console.log('Shortened URL:', body.shrtlnk);
                const shortUrl = body.shrtlnk;
                document.getElementById("shortenedurl").value = shortUrl;

                var copyText = document.getElementById("shortenedurl");
                copyText.select();
                copyText.setSelectionRange(0, 99999);
                document.execCommand("copy");

                document.getElementById("shrtlnk").innerHTML = "√ 已复制";
                var obj = document.getElementById('shrtlnk');
                obj.style.backgroundColor = "#daf2c2";
                obj.style.color = "#397300";

                setTimeout(function () {
                    obj.innerHTML = '<img src="https://shrtlnk.dev/favicon-32x32.png" height="22">';
                    obj.style.backgroundColor = "#f2f2f2";
                    obj.style.color = "#000000";
                }, 3000);
            } else {
                console.error('Error:', body.message);
                document.getElementById("shrtlnk").innerHTML = '<img src="https://shrtlnk.dev/favicon-32x32.png" height="22">';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("shrtlnk").innerHTML = '<img src="https://shrtlnk.dev/favicon-32x32.png" height="22">';
        });
}

function spoome() {
    const url = 'https://spoo.me/';
    const longUrl = document.getElementById("utmresult").value;

    const data = new URLSearchParams();
    data.append('url', longUrl);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    document.getElementById("shortenedurl").value = "";
    document.getElementById("spoome").innerHTML = "生成中";

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                const response = JSON.parse(xhr.responseText);
                const shortUrl = response.short_url;

                console.log('Shortened URL:', shortUrl);
                document.getElementById("shortenedurl").value = shortUrl;

                var copyText = document.getElementById("shortenedurl");
                copyText.select();
                copyText.setSelectionRange(0, 99999);
                document.execCommand("copy");

                document.getElementById("spoome").innerHTML = "√ 已复制";
                var obj = document.getElementById('spoome');
                obj.style.backgroundColor = "#daf2c2";
                obj.style.color = "#397300";

                setTimeout(function () {
                    obj.innerHTML = '<img src="https://spoo.me/static/images/favicon.png" height="22">';
                    obj.style.backgroundColor = "#f2f2f2";
                    obj.style.color = "#000000";
                }, 3000);
            } else {
                console.error(`HTTP error! Status: ${xhr.status}`);
                document.getElementById("spoome").innerHTML = '<img src="https://spoo.me/static/images/favicon.png" height="22">';
            }
        }
    };

    xhr.send(data);
}



function updatetmlresult() {
    const websiteurl = document.getElementById('websiteurl').value;
    const utm_id = document.getElementById('utm_id').value;
    const utm_source = document.getElementById('utm_source').value;
    const utm_medium = document.getElementById('utm_medium').value;
    const utm_campaign = document.getElementById('utm_campaign').value;
    const utm_ad = document.getElementById('utm_ad').value;
    const utm_term = document.getElementById('utm_term').value;
    const utm_content = document.getElementById('utm_content').value;

    let result = "";
    if (websiteurl) {
        result = websiteurl;
        if (utm_id) {
            result += `&utm_id=${utm_id}`;
        }
        if (utm_source) {
            result += `&utm_source=${utm_source}`;
        }
        if (utm_medium) {
            result += `&utm_medium=${utm_medium}`;
        }
        if (utm_campaign) {
            result += `&utm_campaign=${utm_campaign}`;
        }
        if (utm_ad) {
            result += `&utm_ad=${utm_ad}`;
        }
        if (utm_term) {
            result += `&utm_term=${utm_term}`;
        }
        if (utm_content) {
            result += `&utm_content=${utm_content}`;
        }
    }
    if (result.indexOf('?') === -1 && result.indexOf('&') !== -1) {
        result = result.replace('&', '?');
    }

    document.getElementById('utmresult').value = result;

}
async function removeUrlParameters() {
    const romove_url = document.getElementById('websiteurl').value;
    let urlObj = new URL(romove_url);
    let params = new URLSearchParams(urlObj.search);

    let allowedParams = new URLSearchParams();

    for (let [key, value] of params.entries()) {
        if (key === 'ids') {
            allowedParams.append(key, value);
        }
    }

    let newUrl = urlObj.origin + urlObj.pathname + '?' + allowedParams.toString();
    document.getElementById('websiteurl').value = newUrl;
    try {
        await navigator.clipboard.writeText(newUrl);
        console.log('Text copied to clipboard: ' + newUrl);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
    document.getElementById("removeUrlParameters").innerHTML = "√";
    var obj = document.getElementById('removeUrlParameters');
    obj.style.backgroundColor = "#daf2c2";
    obj.style.color = "#397300";
    setTimeout(function () {
        obj.innerHTML = "⚝";
        obj.style.backgroundColor = "#f2f2f2";
        obj.style.color = "#000000";
    }, 3000);
}
setInterval("updatetmlresult()", 1000);
