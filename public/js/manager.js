function openModal(e) {
    e = $(e).children('img')

    let filename = e.data('filename')
    let id = e.data('id')
    let size = e.data('size')
    let width = e.data('width')
    let heigth = e.data('height')
    let date = e.data('date')
    let href = e.data('href')
    let type = e.data('type')
    let vip = e.data('vip')

    if (vip) $('.custom-modal-header').css({'background' : '#460875' })
    else $('.custom-modal-header').css({'background' : '' })

    console.log(type)

    if (type !== 1) {
        $('#btnDownloadImgPreview').attr('href', href)
        $('#modalPreviewTitle').html(`
        ${vip ? '<span class="vip-tag">VIP</span>' : ''} ${id} - <a href="${href}" class="file-name text-warning">${filename}</a> (${size} ${width}x${heigth}px) - ${date}
        `)
        href = location.origin + href
        $('#searchUrl').html(`
            Search: <a target="_blank" class="text-warning" href="//www.google.com/searchbyimage?image_url=${href}">Google</a> / <a target="_blank" class="text-warning" href="//iqdb.org/?url=${href}">IQDB</a> / <a target="_blank" class="text-warning" href="//saucenao.com/search.php?url=${href}">SauceNao</a>
        `)
        $('#modalImgPreview').attr('src', e.attr('src'))
        $('#imgViewModal').modal('show')
    }
}

function delEvent(e) {
    e = $(e).children('img')

    let type = e.data('type')
    let mode = $('#mode').val()
    let id = e.data('id')

    if (mode === 'admin') {
        let pass = $('#passMode').val()
        let boardType = 'i'
        if (type === 1) boardType = 'v'
        if (type === 2) boardType = 'a'

        fetch(`/${boardType}/del?pass=${pass}`, {
            method: 'DELETE',
            headers: { 'Content-Type' : 'application/json' },
            body : JSON.stringify({ id : id })
        })
        .then(async(res) => {
            if (res && res.status === 200) {
                $(`#itemImg-${id}, #itemVideo-${id}, #itemAudio-${id}`).remove()
            }
        })   
    }
}

$(document).ready((e) => {
    const shParams = new URLSearchParams(location.search)
    let page = shParams.has('page') ? shParams.get('page') : ''

    let boardType = location.pathname.replace(/\//g, '')


    $('#btnCloseImgPreviewModal').on('click', (e) => {
        $('#imgViewModal').modal('hide')
    })
    
    let defaultTitle = $('#pageTitle').text()
    let notifyCount = 0
    async function fetchFiles(len) {
        fetch(`/render/${boardType}?set=${len}`, {
            method: 'GET',
            headers: { 'Content-Type' : 'text/html; charset=utf-8' },
        })
        .then(async(res) => {
            if (res && res.status === 200) {
                let data = await res.text()
                if (data.length > 0) {
                    $('#itemContainer').prepend(data)
                                        
                    let raw = $($.parseHTML(data))
                    if (raw && raw.length > 0) notifyCount += raw.length
                    
                    if (notifyCount > 0) {
                        $('#notFoundMessage').hide()
                        $('#totalPage').text(parseInt($('#totalPage').text()) + raw.length)
                        $('#pageTitle').text(`(${notifyCount}) ` + defaultTitle)
                    }
                }
            }
        })
    }
    $(document).on('mousemove', (e) => {
        $('#pageTitle').text(defaultTitle)
        notifyCount = 0
    })

    function startNotifyTimer() {
        let tinInit = 5
        let c = tinInit
        setInterval(() => {
            if (c-- < 0) {
                if (tinInit < 120) tinInit = tinInit + 2            
                c = tinInit
                fetchFiles(parseInt($('#totalPage').text()))
            }
        }, 1000)
    }
    if (!page || page && page <= 1) startNotifyTimer()
})