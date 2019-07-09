'use strict';

const Controller = require('egg').Controller;
const Crawler = require("crawler");

class CrawlerController extends Controller {

    getUrls() {
        var i = 1;
        var queue = []
        const url = 'https://know.baidu.com/wenda/ajax/getquestionreplylist?qid=c5109763b05ac0fc062421dbe2dda51880a721d&bdsToken=8a3f3ab04ff3264274de15d0889a8f46%231562563933&base=';
        while (i < 20) {
            const base = i * 1;
            var uri = url + base;
            queue.push(uri);
            i++;
        };
        return queue;
    }

    async crawl() {
        const { ctx } = this;
        let crawlerArticle = new Crawler({
            maxConnections: 1,

            callback: (error, res, done) => {
                if (error) {
                    console.log(error);
                } else {

                }
                done();
            }
        });
        const linkQueue = 'https://know.baidu.com/question/c5109763b05ac0fc062421dbe2dda51880a721d&base=20';

        crawlerArticle.queue([{
            uri: linkQueue,
            // jQuery: false,
            // The global callback won't be called
            callback: function (error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    var $ = res.$;
                    let article = {};
                    let $title = $('.question-title');
                    $title.find('.isVoting').remove();
                    $title.find('.line').remove();
                    article.title = $title.text().trim('/\n\g/');
                    article.list = [];
                    $('.list').find('.answer-list').each((i, item) => {
                        let answer = {};
                        const $answer = $(item);
                        const author_portrait = $answer.find('.author-portrait').find('a >img').attr('src');
                        answer.author_portrait = author_portrait;

                        const author_name = $answer.find('.author-name').find('>a').text();
                        answer.author_name = author_name.replace(/^\s+|\s+$/g, "");

                        const answer_content = $answer.find('.answer-content').find('.con').text().replace(/^\s+|\s+$/g, "");
                        answer.answer_content = answer_content;

                        const answer_time = $answer.find('.answer-time').text();
                        answer.answer_time = answer_time;

                        article.list.push(answer);
                    });
                    console.log('article ', article);
                }
                done();
            }
        }]);
        ctx.body = 'craw, done';
    }

    async fetchApi() {
        const urls = this.getUrls();
        const articles = await Promise.all(
            urls.map(url => {
                return this.ctx.curl(url, { dataType: 'json' });
            })
        );
        const allData = articles.map((article, index) => {
            return article.data.data.list.map(item => item);
        });

        this.ctx.body = allData;
    }
}

module.exports = CrawlerController;
