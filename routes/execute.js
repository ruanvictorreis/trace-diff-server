var fs = require('fs')
var jsdiff = require('diff')
var express = require('express');
var router = express.Router();
var PythonShell = require('python-shell')

router.post('/', function(req, res) {
	attempt = req.body;
	
	const trace = new Trace();
	trace.load(attempt);
	trace.generate();
	
	res.json(attempt);
});

class Trace {
  constructor() {
    this.items = []
    this.results = []
  }

  load(attempt) {
    this.items = [attempt]
  }

  generate() {
	const path = `./data/generated/attempt.json`
    console.log(`generating attempt`)  
	
    let results = []
    let id = 0
    for (let item of this.items) {
      item = new Item(item, id++)
      item.generate()
      this.results.push(item)
    }
	
	var resultJs = JSON.stringify(this.results, null, 2);
	fs.writeFileSync(path, JSON.stringify(this.results, null, 2))
	console.log('write finish')
    console.log('analyzing behavior...')
    PythonShell.run('python-src/get_trace.py', { args: [resultJs] }, (err) => {
      if (err) throw err
      console.log('generate finish')
    })
  }
}

class Item {
  constructor(item, id) {
    this.item = item
    this.id = id
    this.studentId = this.item.studentId
    this.rule = this.item.UsedFix
    this.before = this.item.before
    this.after = this.item.SynthesizedAfter
    this.code = ''
    this.diffs = []
    this.added = []
    this.removed = []
  }

  generate() {
    this.getDiff()
	this.getTest()
    delete this.item
  }

  getDiff() {
    if (this.before.includes('from operator import')) {
      let lines = []
      for (let line of this.before.split('\r\n')) {
        if (line.includes('from operator import')) continue
        lines.push(line)
      }
      this.before = lines.join('\n')
    }
    
	this.before = this.before.replace(/\r\n/g, '\n');
    this.after = this.after.replace(/\r\n/g, '\n');

    let diffs = jsdiff.diffJson(this.before, this.after)
    let line = -1
    let code = ''
    let added = []
    let removed = []
    let addedLine = []
    let removedLine = []
	
    for (let diff of diffs) {
      let lines = diff.value.split('\n')
      for (let i = 0; i < diff.count; i++) {
        code += lines[i]
        code += '\n'
        line++
        if (diff.added) {
          added.push(line)
          addedLine.push({ line: line, code: lines[i] })
        }
        if (diff.removed) {
          removed.push(line)
          removedLine.push({ line: line, code: lines[i] })
        }
      }
    }
	
    this.code = code
    this.diffs = diffs
    this.added = added
    this.removed = removed
    this.addedLine = addedLine
    this.removedLine = removedLine
  }

  getTest() {
    let i = 0
    let testIndex = 0
    let errorIndex = 0
	let failed = this.item['failed[]']
	
    for (let text of failed) {
      if (text.includes('>>> ')) testIndex = i
      if (text.includes('# Error: expected')) errorIndex = i
      i++
    }
	
    let test = failed[testIndex]
	test = test.substr(8).trim()
    
	let expected = failed[errorIndex+1]
    expected = expected.substr(6).trim()
	
	let result = failed[errorIndex+3]
    result = result.substr(6).trim()
	
	if (!isNaN(parseInt(result))) {
      result = parseInt(result)
    }
	
	if (!isNaN(parseInt(expected))) {
      expected = parseInt(expected)
    }
	
    let log = failed.slice(testIndex, errorIndex+4).join('\n')
	
    this.test = test
    this.expected = expected
    this.result = result
    this.log = log.trim()
  }
}

module.exports = router;