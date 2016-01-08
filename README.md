[![Build Status](https://travis-ci.org/naturenet/naturenet-www.svg)](https://travis-ci.org/naturenet/naturenet-www)

# Git subtree command

[http://yeoman.io/learning/deployment.html)(http://yeoman.io/learning/deployment.html)

You can also maintain the source and built code on the same branch, and deploy only the dist directory with the git subtree command.

Remove the dist directory from the .gitignore file. Yeoman projects ignore it by default.

Add the dist directory to your repository:

	git add dist && git commit -m "Initial dist subtree commit"

Deploy the subtree to a different branch. Specify a relative path to your dist directory with --prefix:

	git subtree push --prefix dist origin gh-pages

Develop normally, committing your entire repository to your default (master) branch.

To deploy the dist directory, run the subtree push command from the root directory:

	git subtree push --prefix dist origin gh-pages

