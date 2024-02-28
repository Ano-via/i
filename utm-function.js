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
                obj.innerHTML = "生成短链";
                obj.style.backgroundColor = "#f2f2f2";
                obj.style.color = "#000000";
            }, 3000);
        })
        .catch(error => {
            console.error('生成Bitly短链接时发生错误:', error);
            document.getElementById("shortenurl").innerHTML = "生成短链";
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
                    obj.innerHTML = "备用1";
                    obj.style.backgroundColor = "#f2f2f2";
                    obj.style.color = "#000000";
                }, 3000);
            } else {
                console.error('生成Tinyurl短链接时发生错误:', data.errors.join(', '));
                document.getElementById("tinyurl").innerHTML = "备用1";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("tinyurl").innerHTML = "备用1";
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
                obj.innerHTML = "备用2";
                obj.style.backgroundColor = "#f2f2f2";
                obj.style.color = "#000000";
            }, 3000);
        } else {
            console.error('Error:', data.msg);
            document.getElementById("reurl").innerHTML = "备用2";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("reurl").innerHTML = "备用2";
    });
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

setInterval("updatetmlresult()", 1000);
