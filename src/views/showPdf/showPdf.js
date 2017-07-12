
import PDFJS from 'pdfjs-dist';
PDFJS.workerSrc = require('pdfjs-dist/build/pdf.worker');

export default {
    name: 'pdfDetails',
    data() {
        return {
            isNotData: {
                type: false,
                msg: '抱歉，此文件不存在',
            },
            fileName: '',
            isLoadType: false,
            startPages: 1, // 起始页码
            pages: 10, // 加载的页数
            urlPdf: '',
            ele: null,
        };
    },
    mounted() {
        const {
            id,
            name,
        } = this.$route.params;
        this.fileName = name;
        this.urlPdf = require('../../assets/test.pdf');
        this.ele = document.querySelector('#theCanvas');

        this.renderPDF(this.urlPdf, this.ele);
    },
    methods: {
        renderPDF(url, canvasContainer) {
            // store.dispatch('showLoading', '加载中...');

            const renderPage = (page) => {
                const viewport = page.getViewport(1);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const viewportWidth = viewport.width;
                const viewportHeight = viewport.height;
                const _width = window.screen.width;
                const _hetiht = (_width * viewportHeight) / viewportWidth;

                // 渲染后得到PDF的比例和宽高和比例，重新计算赋值
                viewport.transform[0] = _width / viewportWidth;
                viewport.transform[3] = -_width / viewportWidth;
                viewport.transform[5] = _hetiht;
                viewport.viewBox[2] = _width;
                viewport.viewBox[3] = _hetiht;


                const renderContext = {
                    canvasContext: ctx,
                    viewport,
                };

                canvas.width = _width;
                canvas.height = _hetiht;
                canvasContainer.appendChild(canvas);

                page.render(renderContext);
            };
            const renderPages = (pdfDoc) => {
                let page = 0;

                if (pdfDoc.numPages > this.pages) {
                    this.isLoadType = true;
                    page = this.pages;
                } else {
                    this.isLoadType = false;
                    page = pdfDoc.numPages;
                    this.pages = 0;
                }
                for (let num = this.startPages; num <= page; num++) {
                    pdfDoc.getPage(num).then(renderPage);
                }
                // store.dispatch('hideLoading');
            };
            // PDFJS.disableWorker = true;

            PDFJS.getDocument(url).promise.then(renderPages).catch((reason) => {
                // store.dispatch('hideLoading');
                if (reason && reason.message) {
                    this.isNotData.type = true;
                } else {
                    this.isNotData.type = false;
                }
            });
        },
        getDatas() {
            // 要在已加载页数上+1，不然会重复一页
            this.startPages = this.pages + 1;
            this.pages += 10;
            this.renderPDF(this.urlPdf, this.ele);
        },
    },
};
