REPORTER=dot

default:

all:

test:
	NODE_PATH=./lib NODE_ENV=test ./node_modules/.bin/mocha \
	--reporter $(REPORTER) \
	--timeout 10000 \
	test/*.js

coverage: lib-cov
	NODE_PATH=./lib-cov NODE_ENV=test ./node_modules/.bin/mocha \
	--reporter html-cov \
	--timeout 10000 \
	test/*.js > coverage.html

lib-cov:
	./node_modules/.bin/node-jscoverage lib lib-cov

clean:
	-rm -rf lib-cov

.PHONY: test coverage
