describe('Wick.Tools.FillBucket', function() {
    it('should activate without errors', function() {
        var project = new Wick.Project();
        project.tools.fillbucket.activate();
    });

    it('Should fill a hole made by a few paths', function(done) {
        var project = new Wick.Project();
        var fillbucket = project.tools.fillbucket;

        project.view.on('canvasModified', function (e) {
            expect(project.activeFrame.paths.length).to.equal(5);
            expect(project.activeFrame.paths[0].view.item.fillColor.toCSS(true)).to.equal('#ff0000');
            expect(project.activeFrame.paths[0].view.item.bounds.width).to.be.closeTo(30, 10);
            expect(project.activeFrame.paths[0].view.item.bounds.height).to.be.closeTo(30, 10);
            done();
        });

        var json1 = ["Path",{"segments":[[0,0],[50,0],[50,10],[0,10]],"closed":true,"fillColor":[255,0,0]}];
        var json2 = ["Path",{"segments":[[0,0],[10,0],[10,50],[0,50]],"closed":true,"fillColor":[255,0,0]}]
        var json3 = ["Path",{"segments":[[40,0],[50,0],[50,50],[40,50]],"closed":true,"fillColor":[255,0,0]}]
        var json4 = ["Path",{"segments":[[0,40],[50,40],[50,50],[0,50]],"closed":true,"fillColor":[255,0,0]}]

        var path1 = new Wick.Path({json: json1});
        var path2 = new Wick.Path({json: json2});
        var path3 = new Wick.Path({json: json3});
        var path4 = new Wick.Path({json: json4});
        project.activeFrame.addPath(path1);
        project.activeFrame.addPath(path2);
        project.activeFrame.addPath(path3);
        project.activeFrame.addPath(path4);
        project.view.render();

        fillbucket.activate();
        project.toolSettings.setSetting('fillColor', new Wick.Color('#ff0000'));
        fillbucket.onMouseDown({point: new paper.Point(15,15), modifiers: {}});
    });

    it('Should fill an existing shape', function(done) {
        var project = new Wick.Project();
        var fillbucket = project.tools.fillbucket;

        project.view.on('canvasModified', function (e) {
            expect(project.activeFrame.paths.length).to.equal(6);
            expect(project.activeFrame.paths[5].view.item.fillColor.toCSS(true)).to.equal('#ff0000');
            expect(project.activeFrame.paths[5].view.item.bounds.width).to.be.closeTo(10, 2);
            expect(project.activeFrame.paths[5].view.item.bounds.height).to.be.closeTo(10, 2);
            done();
        });

        var json1 = ["Path",{"segments":[[0,0],[50,0],[50,10],[0,10]],"closed":true,"fillColor":[255,0,0]}];
        var json2 = ["Path",{"segments":[[0,0],[10,0],[10,50],[0,50]],"closed":true,"fillColor":[255,0,0]}]
        var json3 = ["Path",{"segments":[[40,0],[50,0],[50,50],[40,50]],"closed":true,"fillColor":[255,0,0]}]
        var json4 = ["Path",{"segments":[[0,40],[50,40],[50,50],[0,50]],"closed":true,"fillColor":[255,0,0]}]
        var json5 = ["Path",{"segments":[[20,20],[30,20],[30,30],[20,30]],"closed":true,"fillColor":[255,0,0]}]

        var path1 = new Wick.Path({json: json1});
        var path2 = new Wick.Path({json: json2});
        var path3 = new Wick.Path({json: json3});
        var path4 = new Wick.Path({json: json4});
        var path5 = new Wick.Path({json: json5});
        project.activeFrame.addPath(path1);
        project.activeFrame.addPath(path2);
        project.activeFrame.addPath(path3);
        project.activeFrame.addPath(path4);
        project.activeFrame.addPath(path5);
        project.view.render();

        fillbucket.activate();
        project.toolSettings.setSetting('fillColor', new Wick.Color('#ff0000'));
        fillbucket.onMouseDown({point: new paper.Point(25,25), modifiers: {}});
    });

    it('Should add new path at the bottom of the layer if an empty hole was filled', function(done) {
        // TODO
        done();
    });

    it('Should add new path on top of existing path if an existing path was clicked', function(done) {
        // TODO
        done();
    });

    it('Should fill holes between layers', function(done) {
        // TODO
        done();
    });

    it('Should fill existing shapes between layers', function(done) {
        // TODO
        // Make sure this tests against that one bug where the bottom layers were rendering first.
        done();
    });
});
