const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

//Chai cheat sheet can be found here : https://devhints.io/chai

suite('Functional Tests', function() {

    var testThreadId 
    var testReplyId
    var testThreadPw = "test"
    var testReplyPw = "something"

      test('Creating a new thread.', (done) => {
        chai.request(server)
            .post('/api/threads/testBoard')
            .send({
                board: "testBoard",
                text: "this is a test",
                delete_password: testThreadPw
            })
            .end((err, res) => {
            if (err) done(err);
            assert.equal(res.status, 200)
            testThreadId = res.redirects[0].split('/')[res.redirects[0].split('/').length - 1]
            done();
            });
        });

    test('Viewing the 10 most recent threads with 3 replies each.', (done) => {
        chai.request(server)
            .get('/api/threads/testBoard')
            .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body)
            assert.isAtMost(res.body.length,10)
            res.body.forEach(thread => {
                assert.isAtMost(thread.replies.length,3)
                assert.isUndefined(thread.delete_password)
            });
        done();
        });
    });

// Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password

    test('Deleting a thread with the incorrect password', (done) => {
        chai.request(server)
            .del('/api/threads/testBoard')
            .send({board:"testBoard",
                thread_id:testThreadId,
                delete_password:"saded"})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body,"Invalid password")
            done();
        });
    });

// Reporting a thread: PUT request to /api/threads/{board}

    test('Reporting a thread', (done) => {
        chai.request(server)
            .put('/api/threads/testBoard')
            .send({board:"testBoard",
                    thread_id:testThreadId})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body, "Reported")
            done();
        });
    });

// Creating a new reply: POST request to /api/replies/{board}

    test('Creating a new reply', (done) => {
        chai.request(server)
            .post('/api/replies/testBoard')
            .send({board:"testBoard",
                    thread_id:testThreadId,
                    text:"This is a test",
                    delete_password:testReplyPw})
            .end((err, res) => {
            if (err) done(err);
            assert.equal(res.status, 200);
            done();
        });
    });

// Viewing a single thread with all replies: GET request to /api/replies/{board}

    test('Viewing a single thread with all replies', (done) => {
        chai.request(server)
            .get('/api/replies/testBoard') //?thread_id=603628a48666c81808040649')
            .query({thread_id:testThreadId})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body)
                assert.isArray(res.body.replies)       
                testReplyId = res.body.replies[0]._id
                done();
        });
    });

// Deleting a reply with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password

    test('Deleting a reply with the incorrect password', (done) => {
        chai.request(server)
        .del('/api/threads/testBoard')
        .send({board:"testBoard",
        thread_id:testThreadId,
        reply_id:testReplyId,
        delete_password:""
    })
        .end((err, res) => {

            assert.equal(res.status, 200);
            assert.equal(res.body, "Invalid password")
            done();
        });
    });

// Reporting a reply: PUT request to /api/replies/{board}

    test('Reporting a reply: PUT request to /api/replies/{board}', (done) => {
        chai.request(server)
            .put('/api/replies/testBoard')
            .send({thread_id:testThreadId,
            reply_id:testReplyId})
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body, "Reported");
                done();
            });
        });

    // Deleting a reply with the correct password: DELETE request to /api/threads/{board} with a valid delete_password

    test('Deleting a reply with the correct password', (done) => {
        chai.request(server)
        .del('/api/replies/testboard')
        .send({board:"testboard",
            thread_id:testThreadId,
            reply_id:testReplyId,
            delete_password:testReplyPw
        })
        .end((err, res) => {

            assert.equal(res.status, 200);
            assert.equal(res.body, "Success")
            done();
        });
    });

    // Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password

    test('Deleting a thread with the correct password', (done) => {
        chai.request(server)
            .del('/api/threads/testBoard')
            .send({board:"testboard",
            thread_id: testThreadId,
        delete_password:testThreadPw})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body, "Success")
            done();
        });
    });
})
