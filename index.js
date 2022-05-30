const express = require('express');
const app = express();
const template = require('./lib/template.js');
const fs = require('fs');
const qs = require("querystring");

app.get('/', function (req, res) {
    fs.readdir('./data', function(err, filelist){
        const title = 'Welcome';
        // 웹 페이지의 본문 내용
        const description = 'Hello, Node.js';
        // 게시글의 목록
        const list = template.List(filelist);
        const html = template.HTML(title, list, description
            , `<a href="/create">create</a>`);
        res.send(html);
    });
})


app.get('/page/:pageId', function (req, res) {
    fs.readdir('./data', function(err, filelist){
        const list = template.List(filelist);
        const id = req.params.pageId;
        fs.readFile(`./data/${id}`, 'utf8', function (error, description){
            const title = id;
            const html = template.HTML(title, list, description
            , `<a href="/create">create</a>
                <a href="/update/${title}">update</a> 
                <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                </form>`);
            res.send(html);
        })
    })
})


app.get('/create', function (req, res){
  fs.readdir('./data', function (err, filelist) {
    const title = 'WEB - create';
    const list = template.List(filelist);
    const html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
    res.send(html);
  });
});

app.post('/create_process', function(req, res){
  let body = '';
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    const post = qs.parse(body);
    const title = post.title;
    const description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {
      res.redirect(`/page/${title}`);
    });
  });
});

app.get('/update/:pageId', function(req, res){
  fs.readdir('./data', function (err, filelist) {
    const id = req.params.pageId;
    fs.readFile(`data/${id}`, 'utf8', function (error, description) {
      const title = id;
      const list = template.List(filelist);
      const html = template.HTML(title, list,
        `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
        `<a href="/create">create</a> <a href="/update/${title}">update</a>`,
      );
      res.send(html);
    });
  });
});

app.post('/update_process', function (req, res) {
  let body = '';
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    const post = qs.parse(body);
    const id = post.id;
    const title = post.title;
    const description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        res.redirect(`/page/${title}`);
      });
    });
  });
});

app.post('/delete_process', function(req, res){
  let body = '';
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    const post = qs.parse(body);
    const id = post.id;
    fs.unlink(`data/${id}`, function (error) {
      res.redirect(`/`);
    });
  });
});

app.listen(4444);