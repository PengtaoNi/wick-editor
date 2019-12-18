describe('Wick.Tickable', function() {
    describe('#constructor', function () {
        it('should instantiate', function() {
            var tickable = new Wick.Tickable();
            expect(tickable instanceof Wick.Base).to.equal(true);
            expect(tickable instanceof Wick.Tickable).to.equal(true);
            expect(tickable.classname).to.equal('Tickable');
            expect(tickable.identifier).to.equal(null);
        });
    });

    describe('#scripts', function () {
        // TODO
    });

    describe('#onScreen', function () {
        // TODO
    });

    describe('#addScript', function () {
        it('should add scripts', function () {
            var tickable = new Wick.Tickable();

            tickable.addScript('load', 'foo()');
            expect(tickable.scripts.length).to.equal(2);
            expect(tickable.scripts[0].name).to.equal('default');
            expect(tickable.scripts[0].src).to.equal('');
            expect(tickable.scripts[1].name).to.equal('load');
            expect(tickable.scripts[1].src).to.equal('foo()');

            tickable.addScript('update', 'bar()');
            expect(tickable.scripts.length).to.equal(3);
            expect(tickable.scripts[0].name).to.equal('default');
            expect(tickable.scripts[0].src).to.equal('');
            expect(tickable.scripts[1].name).to.equal('load');
            expect(tickable.scripts[1].src).to.equal('foo()');
            expect(tickable.scripts[2].name).to.equal('update');
            expect(tickable.scripts[2].src).to.equal('bar()');
        });

        it('should add scripts, and they should be in order', function () {
            var tickable = new Wick.Tickable();

            tickable.addScript('unload', 'unload_foo()');
            tickable.addScript('update', 'update_foo()');
            tickable.addScript('mouseenter', 'mouseenter_foo()');
            tickable.addScript('load', 'load_foo()');

            expect(tickable.scripts.length).to.equal(5);
            expect(tickable.scripts[0].name).to.equal('default');
            expect(tickable.scripts[0].src).to.equal('');
            expect(tickable.scripts[1].name).to.equal('mouseenter');
            expect(tickable.scripts[1].src).to.equal('mouseenter_foo()');
            expect(tickable.scripts[2].name).to.equal('load');
            expect(tickable.scripts[2].src).to.equal('load_foo()');
            expect(tickable.scripts[3].name).to.equal('update');
            expect(tickable.scripts[3].src).to.equal('update_foo()');
            expect(tickable.scripts[4].name).to.equal('unload');
            expect(tickable.scripts[4].src).to.equal('unload_foo()');
        });

        it('should not add duplicate scripts', function () {
            var tickable = new Wick.Tickable();

            tickable.addScript('load', 'foo()');
            tickable.addScript('load', 'bar()');
            tickable.addScript('load', 'baz()');
            tickable.addScript('default', 'foo()');
            tickable.addScript('default', 'foo()');
            tickable.addScript('default', 'bar()');
            expect(tickable.scripts.length).to.equal(2);
            expect(tickable.scripts[0].name).to.equal('default');
            expect(tickable.scripts[0].src).to.equal('bar()');
            expect(tickable.scripts[1].name).to.equal('load');
            expect(tickable.scripts[1].src).to.equal('baz()');
        });
    });

    describe('#getScript', function () {

    });

    describe('#getAvailableScripts', function () {

    });

    describe('#hasScript', function () {

    });

    describe('#updateScript', function () {

    });

    describe('#removeScript', function () {

    });

    describe('#runScript', function () {

    });

    describe('#tick', function () {
        it('should run empty script without errors', function() {
            var project = new Wick.Project();

            var clip = new Wick.Clip();
            project.addObject(clip);

            clip.addScript('load', '');

            var error = project.tick();
            expect(error).to.equal(null);
        });

        it('should set a property on load without error', function() {
            var project = new Wick.Project();

            var clip = new Wick.Clip();
            project.addObject(clip);

            clip.addScript('load', 'this.randomVariable = "loaded";');

            var error = project.tick();
            expect(error).to.equal(null);
            expect(clip.randomVariable).to.equal("loaded");
        });

        it('should set a variable on load without error', function() {
            var project = new Wick.Project();

            var clip = new Wick.Clip();
            project.addObject(clip);

            clip.addScript('load', 'var randomVariable = "a"; this.randomVariable = randomVariable');

            var error = project.tick();
            expect(error).to.equal(null);
            expect(clip.randomVariable).to.equal("a");
        });

        it('should update a property over multiple ticks', function() {
            var project = new Wick.Project();

            var clip = new Wick.Clip();
            project.addObject(clip);

            clip.addScript('load', 'this.randomVariable = 0;');
            clip.addScript('update', 'this.randomVariable += 1;');
            clip.addScript('unload', 'this.randomVariable = null;');

            var error = project.tick();
            expect(error).to.equal(null);
            expect(clip.randomVariable).to.equal(0);

            error = project.tick();
            expect(error).to.equal(null);
            expect(clip.randomVariable).to.equal(1);

            error = project.tick();
            expect(error).to.equal(null);
            expect(clip.randomVariable).to.equal(2);
        });

        it('should return correct info for a syntax error', function() {
            var project = new Wick.Project();

            var clip = new Wick.Clip();
            project.addObject(clip);

            clip.addScript('load', 'fn();\nfn(');

            var error = project.tick();
            expect(error).to.not.equal(null);
            expect(error.name).to.equal('load');
            expect(error.lineNumber).to.equal(2);
            expect(error.message).to.equal('Unexpected end of input');
            expect(error.uuid).to.equal(clip.uuid);

            clip.addScript('load', '');
            clip.addScript('update', 'fn()\nfn()\nfn(');

            var error = project.tick();
            expect(error).to.not.equal(null);
            expect(error.name).to.equal('update');
            expect(error.lineNumber).to.equal(3);
            expect(error.message).to.equal('Unexpected end of input');
            expect(error.uuid).to.equal(clip.uuid);
        });

        it('should return correct info for a runtime error', function() {
            var project = new Wick.Project();

            var clip = new Wick.Clip();
            project.addObject(clip);

            clip.addScript('load', 'thisWillCauseAnError();');
            clip.addScript('update', 'var i = 0;\ni++\n\nthisWillCauseAnError();');

            var error = project.tick();
            expect(error).to.not.equal(null);
            expect(error.lineNumber).to.equal(1);
            expect(error.message).to.equal('thisWillCauseAnError is not defined');
            expect(error.uuid).to.equal(clip.uuid);

            var error = project.tick();
            expect(error).to.not.equal(null);
            expect(error.lineNumber).to.equal(4);
            expect(error.message).to.equal('thisWillCauseAnError is not defined');
            expect(error.uuid).to.equal(clip.uuid);
        });

        it('should run correct mouse scripts for different mouse states', function() {
            var project = new Wick.Project();

            var clip = new Wick.Clip();
            project.addObject(clip);

            clip.addScript('mouseenter', 'this.__mouseenter = true;');
            clip.addScript('mousepressed', 'this.__mousepressed = true;');
            clip.addScript('mousedown', 'this.__mousedown = true;');
            clip.addScript('mousereleased', 'this.__mousereleased = true;');
            clip.addScript('mouseleave', 'this.__mouseleave = true;');
            clip.addScript('mousehover', 'this.__mousehover = true;');
            clip.addScript('mousedrag', 'this.__mousedrag = true;');
            clip.addScript('mouseclick', 'this.__mouseclick = true;');

            function resetMouseStateFlags () {
                clip.__mouseenter = false;
                clip.__mousepressed = false;
                clip.__mousedown = false;
                clip.__mousereleased = false;
                clip.__mouseleave = false;
                clip.__mousehover = false;
                clip.__mousedrag = false;
                clip.__mouseclick = false;
            }

            var project = new Wick.Project();
            project.activeFrame.addClip(clip);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [];
            project.tools.interact._mouseIsDown = false;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(false);
            expect(clip.__mousepressed).to.equal(false);
            expect(clip.__mousedown).to.equal(false);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(false);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(false);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [clip];
            project.tools.interact._mouseIsDown = false;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(true);
            expect(clip.__mousepressed).to.equal(false);
            expect(clip.__mousedown).to.equal(false);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(true);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(false);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [clip];
            project.tools.interact._mouseIsDown = true;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(false);
            expect(clip.__mousepressed).to.equal(true);
            expect(clip.__mousedown).to.equal(true);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(false);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(false);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [clip];
            project.tools.interact._mouseIsDown = true;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(false);
            expect(clip.__mousepressed).to.equal(false);
            expect(clip.__mousedown).to.equal(true);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(false);
            expect(clip.__mousedrag).to.equal(true);
            expect(clip.__mouseclick).to.equal(false);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [clip];
            project.tools.interact._mouseIsDown = false;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(false);
            expect(clip.__mousepressed).to.equal(false);
            expect(clip.__mousedown).to.equal(false);
            expect(clip.__mousereleased).to.equal(true);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(true);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(true);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [];
            project.tools.interact._mouseIsDown = false;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(false);
            expect(clip.__mousepressed).to.equal(false);
            expect(clip.__mousedown).to.equal(false);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(true);
            expect(clip.__mousehover).to.equal(false);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(false);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [clip];
            project.tools.interact._mouseIsDown = false;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(true);
            expect(clip.__mousepressed).to.equal(false);
            expect(clip.__mousedown).to.equal(false);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(true);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(false);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [clip];
            project.tools.interact._mouseIsDown = false;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(false);
            expect(clip.__mousepressed).to.equal(false);
            expect(clip.__mousedown).to.equal(false);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(true);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(false);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [clip];
            project.tools.interact._mouseIsDown = true;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(false);
            expect(clip.__mousepressed).to.equal(true);
            expect(clip.__mousedown).to.equal(true);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(false);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(false);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [clip];
            project.tools.interact._mouseIsDown = true;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(false);
            expect(clip.__mousepressed).to.equal(false);
            expect(clip.__mousedown).to.equal(true);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(false);
            expect(clip.__mousedrag).to.equal(true);
            expect(clip.__mouseclick).to.equal(false);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [];
            project.tools.interact._mouseIsDown = false;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(false);
            expect(clip.__mousepressed).to.equal(false);
            expect(clip.__mousedown).to.equal(false);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(true);
            expect(clip.__mousehover).to.equal(false);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(false);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [clip];
            project.tools.interact._mouseIsDown = false;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(true);
            expect(clip.__mousepressed).to.equal(false);
            expect(clip.__mousedown).to.equal(false);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(true);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(false);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [clip];
            project.tools.interact._mouseIsDown = true;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(false);
            expect(clip.__mousepressed).to.equal(true);
            expect(clip.__mousedown).to.equal(true);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(false);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(false);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [clip];
            project.tools.interact._mouseIsDown = false;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(false);
            expect(clip.__mousepressed).to.equal(false);
            expect(clip.__mousedown).to.equal(false);
            expect(clip.__mousereleased).to.equal(true);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(true);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(true);

            resetMouseStateFlags();
            project.tools.interact._mouseTargets = [clip];
            project.tools.interact._mouseIsDown = false;
            expect(project.tick()).to.equal(null);
            expect(clip.__mouseenter).to.equal(false);
            expect(clip.__mousepressed).to.equal(false);
            expect(clip.__mousedown).to.equal(false);
            expect(clip.__mousereleased).to.equal(false);
            expect(clip.__mouseleave).to.equal(false);
            expect(clip.__mousehover).to.equal(true);
            expect(clip.__mousedrag).to.equal(false);
            expect(clip.__mouseclick).to.equal(false);
        });

        it('should run scripts attached using onEvent', function() {
            var clip = new Wick.Clip();
            clip.addScript('default', 'onEvent("load", () => { this.__project = project });');

            var project = new Wick.Project();
            project.activeFrame.addClip(clip);

            expect(project.tick()).to.equal(null);

            expect(clip.__project).to.equal(project.root);
        });

        it('should run multiple scripts attached using onEvent', function() {
            var clip = new Wick.Clip();
            clip.__eventRanCount = 0;
            var src = '';
            src += 'onEvent("load", () => { this.__loadEvent1Ran = true; });';
            src += 'onEvent("load", function () { this.__loadEvent2Ran = true; });';
            src += 'onEvent("load", () => { this.__loadEvent3Ran = true; });';
            clip.addScript('default', src);

            var project = new Wick.Project();
            project.activeFrame.addClip(clip);

            expect(project.tick()).to.equal(null);
            expect(clip.__loadEvent1Ran).to.equal(true);
            expect(clip.__loadEvent2Ran).to.equal(true);
            expect(clip.__loadEvent3Ran).to.equal(true);
        });

        it('should catch errors from scripts attached using onEvent', function() {
            var clip = new Wick.Clip();
            clip.addScript('default', 'onEvent("load", () => { foo });');

            var project = new Wick.Project();
            project.activeFrame.addClip(clip);

            expect(project.tick().message).to.equal('foo is not defined');
        });
    });
});
