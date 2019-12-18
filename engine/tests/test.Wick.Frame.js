describe('Wick.Frame', function() {
    describe('#constructor', function () {
        it('should instatiate correctly', function() {
            var frame = new Wick.Frame();
            expect(frame.start).to.equal(1);
            expect(frame.end).to.equal(1);
            expect(frame instanceof Wick.Base).to.equal(true);
            expect(frame instanceof Wick.Tickable).to.equal(true);
            expect(frame instanceof Wick.Frame).to.equal(true);
            expect(frame.classname).to.equal('Frame');
            expect(frame.scripts instanceof Array).to.equal(true);
            expect(frame.scripts.length).to.equal(1);
            expect(frame.clips instanceof Array).to.equal(true);
            expect(frame.clips.length).to.equal(0);
            expect(frame.tweens instanceof Array).to.equal(true);
            expect(frame.tweens.length).to.equal(0);

            expect(frame.start).to.equal(1);
            expect(frame.end).to.equal(1);
            expect(frame.length).to.equal(1);
            expect(frame.midpoint).to.equal(1);

            frame = new Wick.Frame({start:5});
            expect(frame.start).to.equal(5);
            expect(frame.end).to.equal(5);
            expect(frame.length).to.equal(1);
            expect(frame.midpoint).to.equal(5);

            frame = new Wick.Frame({start:5, end:10});
            expect(frame.start).to.equal(5);
            expect(frame.end).to.equal(10);
            expect(frame.length).to.equal(6);
            expect(frame.midpoint).to.equal(7.5);
        });
    });

    describe('#copy', function () {
        it('should copy correctly (empty frame)', function() {
            var frame = new Wick.Frame();

            var copy = frame.copy();

            expect(frame.start).to.equal(1);
            expect(frame.end).to.equal(1);
            expect(frame instanceof Wick.Base).to.equal(true);
            expect(frame instanceof Wick.Tickable).to.equal(true);
            expect(frame instanceof Wick.Frame).to.equal(true);
            expect(frame.classname).to.equal('Frame');
            expect(frame.scripts instanceof Array).to.equal(true);
            expect(frame.scripts.length).to.equal(1);
            expect(frame.clips instanceof Array).to.equal(true);
            expect(frame.clips.length).to.equal(0);
            expect(frame.tweens instanceof Array).to.equal(true);
            expect(frame.tweens.length).to.equal(0);

            expect(frame.start).to.equal(1);
            expect(frame.end).to.equal(1);
            expect(frame.length).to.equal(1);
            expect(frame.midpoint).to.equal(1);

            expect(copy.start).to.equal(1);
            expect(copy.end).to.equal(1);
            expect(copy instanceof Wick.Base).to.equal(true);
            expect(copy instanceof Wick.Tickable).to.equal(true);
            expect(copy instanceof Wick.Frame).to.equal(true);
            expect(copy.classname).to.equal('Frame');
            expect(copy.scripts instanceof Array).to.equal(true);
            expect(copy.scripts.length).to.equal(1);
            expect(copy.clips instanceof Array).to.equal(true);
            expect(copy.clips.length).to.equal(0);
            expect(copy.tweens instanceof Array).to.equal(true);
            expect(copy.tweens.length).to.equal(0);

            expect(copy.start).to.equal(1);
            expect(copy.end).to.equal(1);
            expect(copy.length).to.equal(1);
            expect(copy.midpoint).to.equal(1);
        });
    });

    describe('#inPosition', function () {
        it('inPosition should be calculated correctly', function() {
            var frame = new Wick.Frame();
            expect(frame.inPosition(1)).to.equal(true);
            expect(frame.inPosition(2)).to.equal(false);

            frame = new Wick.Frame({start:5, end:10});
            expect(frame.inPosition(1)).to.equal(false);
            expect(frame.inPosition(4)).to.equal(false);
            expect(frame.inPosition(5)).to.equal(true);
            expect(frame.inPosition(7)).to.equal(true);
            expect(frame.inPosition(10)).to.equal(true);
            expect(frame.inPosition(11)).to.equal(false);
        });
    });

    describe('#inRange', function () {
        it('inRange should be calculated correctly', function() {
            var frame = new Wick.Frame();
            expect(frame.inRange(1,1)).to.equal(true);
            expect(frame.inRange(1,2)).to.equal(true);
            expect(frame.inRange(2,2)).to.equal(false);
            expect(frame.inRange(2,3)).to.equal(false);
            expect(frame.inRange(3,10)).to.equal(false);

            frame = new Wick.Frame({start:5, end:10});
            expect(frame.inRange(1,1)).to.equal(false);
            expect(frame.inRange(1,4)).to.equal(false);
            expect(frame.inRange(1,5)).to.equal(true);
            expect(frame.inRange(5,5)).to.equal(true);
            expect(frame.inRange(5,10)).to.equal(true);
            expect(frame.inRange(5,15)).to.equal(true);
            expect(frame.inRange(0,15)).to.equal(true);
            expect(frame.inRange(4,6)).to.equal(true);
            expect(frame.inRange(9,11)).to.equal(true);
            expect(frame.inRange(10,11)).to.equal(true);
            expect(frame.inRange(11,15)).to.equal(false);
        });
    });

    describe('#containedWithin', function () {
        it('containedWithin should be calculated correctly', function() {
            var frame = new Wick.Frame();
            expect(frame.containedWithin(1,1)).to.equal(true);
            expect(frame.containedWithin(1,2)).to.equal(true);
            expect(frame.containedWithin(2,2)).to.equal(false);
            expect(frame.containedWithin(2,3)).to.equal(false);
            expect(frame.containedWithin(3,10)).to.equal(false);

            frame = new Wick.Frame({start:5, end:10});
            expect(frame.containedWithin(1,1)).to.equal(false);
            expect(frame.containedWithin(1,4)).to.equal(false);
            expect(frame.containedWithin(1,5)).to.equal(false);
            expect(frame.containedWithin(5,5)).to.equal(false);
            expect(frame.containedWithin(5,10)).to.equal(true);
            expect(frame.containedWithin(5,15)).to.equal(true);
            expect(frame.containedWithin(0,15)).to.equal(true);
            expect(frame.containedWithin(4,6)).to.equal(false);
            expect(frame.containedWithin(9,11)).to.equal(false);
            expect(frame.containedWithin(10,11)).to.equal(false);
            expect(frame.containedWithin(11,15)).to.equal(false);
        });
    });

    describe('#onScreen', function () {
        it('should only be considered on screen if the parent playhead is over the frame', function () {
            var project = new Wick.Project();

            var frame1 = project.activeFrame;
            var frame2 = new Wick.Frame({start: 2});
            project.activeLayer.addFrame(frame2);

            project.activeTimeline.playheadPosition = 1;
            expect(frame1.onScreen).to.equal(true);
            expect(frame2.onScreen).to.equal(false);

            project.activeTimeline.playheadPosition = 2;
            expect(frame1.onScreen).to.equal(false);
            expect(frame2.onScreen).to.equal(true);
        });

        it('should not be on screen if the parent playhead is over the frame, but the parent clip is not on screen', function () {
            var project = new Wick.Project();

            var frame1 = project.activeFrame;
            var frame2 = new Wick.Frame({start: 2});
            project.activeLayer.addFrame(frame2);

            var clip1 = new Wick.Clip();
            frame1.addClip(clip1);
            var clip2 = new Wick.Clip();
            frame2.addClip(clip2);

            project.activeTimeline.playheadPosition = 1;
            expect(clip1.activeFrame.onScreen).to.equal(true);
            expect(clip2.activeFrame.onScreen).to.equal(false);

            project.activeTimeline.playheadPosition = 2;
            expect(clip1.activeFrame.onScreen).to.equal(false);
            expect(clip2.activeFrame.onScreen).to.equal(true);
        });
    });

    describe('#contentful', function () {
        it('should determine contentful correctly', function() {
            var frameEmpty = new Wick.Frame();

            var frameOnePath = new Wick.Frame();
            frameOnePath.addPath(new Wick.Path({json: TestUtils.TEST_PATH_JSON_RED_SQUARE}));

            var frameOneClip = new Wick.Frame();
            frameOneClip.addClip(new Wick.Clip());

            var frameOneClipOnePath = new Wick.Frame();
            frameOneClipOnePath.addPath(new Wick.Path({json: TestUtils.TEST_PATH_JSON_RED_SQUARE}));
            frameOneClipOnePath.addClip(new Wick.Clip());

            expect(frameEmpty.contentful).to.equal(false);
            expect(frameOnePath.contentful).to.equal(true);
            expect(frameOneClip.contentful).to.equal(true);
            expect(frameOneClipOnePath.contentful).to.equal(true);
        });
    });

    describe('#getActiveTween', function () {
        it('should calculate active tween', function () {
            var project = new Wick.Project();
            var frame = project.activeFrame;
            frame.end = 9;

            var tweenA = new Wick.Tween({
                playheadPosition: 1,
                transformation: new Wick.Transformation({
                    x: 0,
                    y: 0,
                    scaleX: 1,
                    scaleY: 1,
                    rotation: 0,
                    opacity: 1,
                }),
                fullRotations: 0,
            });
            var tweenB = new Wick.Tween({
                playheadPosition: 5,
                transformation: new Wick.Transformation({
                    x: 100,
                    y: 200,
                    scaleX: 2,
                    scaleY: 0.5,
                    rotation: 180,
                    opacity: 0,
                }),
                fullRotations: 0,
            });
            var tweenC = new Wick.Tween({
                playheadPosition: 9,
                transformation: new Wick.Transformation({
                    x: 100,
                    y: 200,
                    scaleX: 2,
                    scaleY: 0.5,
                    rotation: 180,
                    opacity: 1.0,
                }),
                fullRotations: 0,
            });
            frame.addTween(tweenA);
            frame.addTween(tweenB);
            frame.addTween(tweenC);

            // Existing tweens
            project.root.timeline.playheadPosition = 1;
            expect(frame.getActiveTween()).to.equal(tweenA);

            project.root.timeline.playheadPosition = 5;
            expect(frame.getActiveTween()).to.equal(tweenB);

            project.root.timeline.playheadPosition = 9;
            expect(frame.getActiveTween()).to.equal(tweenC);

            // Interpolated tweens
            project.root.timeline.playheadPosition = 3;
            var tweenAB = frame.getActiveTween();
            expect(tweenAB.playheadPosition).to.equal(3);
            expect(tweenAB.transformation.x).to.be.closeTo(50, 0.01);
            expect(tweenAB.transformation.y).to.be.closeTo(100, 0.01);
            expect(tweenAB.transformation.scaleX).to.be.closeTo(1.5, 0.01);
            expect(tweenAB.transformation.scaleY).to.be.closeTo(0.75, 0.01);
            expect(tweenAB.transformation.rotation).to.be.closeTo(90, 0.01);
            expect(tweenAB.transformation.opacity).to.be.closeTo(0.5, 0.01);

            project.root.timeline.playheadPosition = 7;
            var tweenBC = frame.getActiveTween();
            expect(tweenBC.playheadPosition).to.equal(7);
            expect(tweenBC.transformation.x).to.be.closeTo(100, 0.01);
            expect(tweenBC.transformation.y).to.be.closeTo(200, 0.01);
            expect(tweenBC.transformation.scaleX).to.be.closeTo(2, 0.01);
            expect(tweenBC.transformation.scaleY).to.be.closeTo(0.5, 0.01);
            expect(tweenBC.transformation.rotation).to.be.closeTo(180, 0.01);
            expect(tweenBC.transformation.opacity).to.be.closeTo(0.5, 0.01);
        });
    });

    describe('#applyTweenTransforms', function () {
        it('applyTweenTransforms should work correctly', function () {
            var project = new Wick.Project();

            var frame = project.activeFrame;
            var clip = new Wick.Clip();
            frame.addClip(clip);
            frame.addTween(new Wick.Tween({
                playheadPosition: 1,
                transformation: new Wick.Transformation({
                    x: 100,
                    y: 200,
                    scaleX: 2,
                    scaleY: 0.5,
                    rotation: 180,
                    opacity: 0.25,
                }),
                fullRotations: 0,
            }));

            frame.applyTweenTransforms();

            expect(clip.transformation.x).to.be.closeTo(100, 0.01);
            expect(clip.transformation.y).to.be.closeTo(200, 0.01);
            expect(clip.transformation.scaleX).to.be.closeTo(2, 0.01);
            expect(clip.transformation.scaleY).to.be.closeTo(0.5, 0.01);
            expect(clip.transformation.rotation).to.be.closeTo(180, 0.01);
            expect(clip.transformation.opacity).to.be.closeTo(0.25, 0.01);
        });
    });

    describe('#tick', function () {
        it('script errors from child clips should bubble up', function() {
            var project = new Wick.Project();
            var frame = project.activeFrame;

            var child = new Wick.Clip();
            child.addScript('load', 'thisWillCauseAnError()');
            frame.addClip(child);

            var error = project.tick();
            expect(error).to.not.equal(null);
            expect(error.message).to.equal('thisWillCauseAnError is not defined');
            expect(error.lineNumber).to.equal(1);
            expect(error.uuid).to.equal(child.uuid);
        });

        it('script errors from child frames should bubble up', function() {
            var project = new Wick.Project();
            var frame = project.activeFrame;

            var child = new Wick.Frame();
            child.addScript('load', 'thisWillCauseAnError()');
            frame.addClip(new Wick.Clip());
            frame.clips[0].timeline.addLayer(new Wick.Layer());
            frame.clips[0].timeline.layers[0].addFrame(child);

            var error = project.tick();
            expect(error).to.not.equal(null);
            expect(error.message).to.equal('thisWillCauseAnError is not defined');
            expect(error.lineNumber).to.equal(1);
            expect(error.uuid).to.equal(child.uuid);
        });

        it('frames should have access to global API', function() {
            var project = new Wick.Project();
            var frame = project.activeFrame;

            frame.addScript('load', 'stop(); play();');
            var error = project.tick();
            expect(error).to.equal(null);
        });

        it('"this" should refer to parent clip (tab)', function() {
            var project = new Wick.Project();
            var clip = new Wick.Clip();
            project.activeFrame.addClip(clip);
            var frame = clip.timeline.layers[0].frames[0];

            frame.addScript('load', 'this.__thisScope = this;');
            expect(project.tick()).to.equal(null);
            expect(frame.parentClip.__thisScope).to.equal(clip);
        });

        it('"this" should refer to parent clip (onEvent)', function() {
            var project = new Wick.Project();
            var clip = new Wick.Clip();
            project.activeFrame.addClip(clip);
            var frame = clip.timeline.layers[0].frames[0];

            frame.addScript('load', 'this.onEvent("update", () => {this.__thisScope = this;});');
            expect(project.tick()).to.equal(null);
            expect(project.tick()).to.equal(null);//we need to tick twice, because the clip has no onEvent functions until the child frame script runs.
            expect(frame.parentClip.__thisScope).to.equal(clip);
        });

        describe('#project', function () {
            it('project should work as expected', function() {
                var project = new Wick.Project();
                var frame = project.activeFrame;

                frame.addScript('load', 'this.__project = project');
                var error = project.tick();
                expect(error).to.equal(null);
                expect(frame.parentClip.__project).to.equal(project.root);
                expect(frame.parentClip.__project.width).to.equal(project.width);
                expect(frame.parentClip.__project.height).to.equal(project.height);
            });
        });

        describe('#parent', function () {
            it('project should work as expected', function() {
                var project = new Wick.Project();
                var frame = project.activeFrame;

                frame.addScript('load', 'this.__parent = parent');
                var error = project.tick();
                expect(error).to.equal(null);
                expect(frame.parentClip.__parent).to.equal(frame.parentClip);
            });
        });

        it('frames should have access to other named objects', function() {
            var project = new Wick.Project();

            var clipA = new Wick.Clip();
            clipA.identifier = 'foo';
            project.activeFrame.addClip(clipA);

            var clipB = new Wick.Clip();
            clipB.identifier = 'bar';
            project.activeFrame.addClip(clipB);

            var clipC = new Wick.Clip();
            project.activeFrame.addClip(clipC);

            var frame = project.activeFrame;

            frame.addScript('load', 'this.__foo = foo; this.__bar = bar;');
            var error = project.tick();
            expect(error).to.equal(null);
            expect(frame.parentClip.__foo).to.equal(clipA);
            expect(frame.parentClip.__bar).to.equal(clipB);
        });

        it('frames should not have access to other named objects on other frames', function() {
            var project = new Wick.Project();
            var frame = new Wick.Frame({start: 2});
            project.root.timeline.activeLayer.addFrame(frame);
            project.root.timeline.playheadPosition = 2;

            var clipA = new Wick.Clip();
            clipA.identifier = 'foo';
            project.activeLayer.frames[0].addClip(clipA);

            var clipB = new Wick.Clip();
            clipB.identifier = 'bar';
            project.activeLayer.frames[0].addClip(clipB);

            frame.addScript('load', 'console.log(bar); this.__bar = bar;');
            var error = project.tick();
            expect(error).not.to.equal(null);
            expect(error.message).to.equal("bar is not defined");
        });

        it('should play/stop sounds', function() {
            var project = new Wick.Project();

            var frame1 = project.activeFrame;
            frame1.end = 5;
            var frame2 = new Wick.Frame({start:6,end:10});
            project.activeLayer.addFrame(frame2);
            var frame3 = new Wick.Frame({start:11,end:15});
            project.activeLayer.addFrame(frame3);

            var sound1 = new Wick.SoundAsset({filename:'test.wav', src:TestUtils.TEST_SOUND_SRC_WAV});
            var sound2 = new Wick.SoundAsset({filename:'test.mp3', src:TestUtils.TEST_SOUND_SRC_WAV});
            project.addAsset(sound1);
            project.addAsset(sound2);

            frame1.sound = sound1;
            frame2.sound = sound2;

            expect(frame1.isSoundPlaying()).to.equal(false);
            expect(frame2.isSoundPlaying()).to.equal(false);

            project.tick(); // playhead = 1

            expect(frame1.isSoundPlaying()).to.equal(true);
            expect(frame2.isSoundPlaying()).to.equal(false);

            project.tick(); // playhead = 2
            project.tick(); // playhead = 3
            project.tick(); // playhead = 4
            project.tick(); // playhead = 5
            project.tick(); // playhead = 6

            expect(frame1.isSoundPlaying()).to.equal(false);
            expect(frame2.isSoundPlaying()).to.equal(true);

            project.tick(); // playhead = 7
            project.tick(); // playhead = 8
            project.tick(); // playhead = 9
            project.tick(); // playhead = 10
            project.tick(); // playhead = 11

            expect(frame1.isSoundPlaying()).to.equal(false);
            expect(frame2.isSoundPlaying()).to.equal(false);
        });
    });

    describe('#createTween', function () {
        it('should create a blank tween if the frame is empty', function () {
            var project = new Wick.Project();

            project.activeFrame.createTween();

            expect(project.activeFrame.paths.length).to.equal(0);
            expect(project.activeFrame.clips.length).to.equal(0);

            expect(project.activeFrame.tweens.length).to.equal(1);

            expect(project.activeFrame.tweens[0].playheadPosition).to.equal(1);
            expect(project.activeFrame.tweens[0].transformation.x).to.equal(0);
            expect(project.activeFrame.tweens[0].transformation.y).to.equal(0);
            expect(project.activeFrame.tweens[0].transformation.scaleX).to.equal(1);
            expect(project.activeFrame.tweens[0].transformation.scaleY).to.equal(1);
            expect(project.activeFrame.tweens[0].transformation.rotation).to.equal(0);
            expect(project.activeFrame.tweens[0].transformation.opacity).to.equal(1);
        });

        it('should create a tween and convert everything on the frame into one clip', function () {
            var project = new Wick.Project();

            var path1 = TestUtils.paperToWickPath(new paper.Path.Rectangle({
                from: new paper.Point(50,50),
                to: new paper.Point(100,100),
                fillColor: 'red',
            }));
            var path2 = TestUtils.paperToWickPath(new paper.Path.Rectangle({
                from: new paper.Point(100,50),
                to: new paper.Point(150,100),
                fillColor: 'green',
            }));
            var path3 = TestUtils.paperToWickPath(new paper.Path.Rectangle({
                from: new paper.Point(100,100),
                to: new paper.Point(150,150),
                fillColor: 'blue',
            }));

            project.activeFrame.addPath(path1);
            project.activeFrame.addPath(path2);
            project.activeFrame.addPath(path3);

            project.activeFrame.createTween();

            expect(project.activeFrame.paths.length).to.equal(0);
            expect(project.activeFrame.clips.length).to.equal(1);

            expect(project.activeFrame.tweens.length).to.equal(1);

            expect(project.activeFrame.tweens[0].playheadPosition).to.equal(1);
            expect(project.activeFrame.tweens[0].transformation.x).to.equal(100);
            expect(project.activeFrame.tweens[0].transformation.y).to.equal(100);
            expect(project.activeFrame.tweens[0].transformation.scaleX).to.equal(1);
            expect(project.activeFrame.tweens[0].transformation.scaleY).to.equal(1);
            expect(project.activeFrame.tweens[0].transformation.rotation).to.equal(0);
            expect(project.activeFrame.tweens[0].transformation.opacity).to.equal(1);
        });

        it('should create a tween and convert everything on the frame into one clip (single path)', function () {
            var project = new Wick.Project();

            var path = TestUtils.paperToWickPath(new paper.Path.Rectangle({
                from: new paper.Point(50,50),
                to: new paper.Point(150,150),
                fillColor: 'red',
            }));

            project.activeFrame.addPath(path);

            project.activeFrame.createTween();

            expect(project.activeFrame.paths.length).to.equal(0);
            expect(project.activeFrame.clips.length).to.equal(1);

            expect(project.activeFrame.tweens.length).to.equal(1);

            expect(project.activeFrame.tweens[0].playheadPosition).to.equal(1);
            expect(project.activeFrame.tweens[0].transformation.x).to.equal(100);
            expect(project.activeFrame.tweens[0].transformation.y).to.equal(100);
            expect(project.activeFrame.tweens[0].transformation.scaleX).to.equal(1);
            expect(project.activeFrame.tweens[0].transformation.scaleY).to.equal(1);
            expect(project.activeFrame.tweens[0].transformation.rotation).to.equal(0);
            expect(project.activeFrame.tweens[0].transformation.opacity).to.equal(1);
        });
    });

    describe('#dynamicTextPaths', function () {
        it('should return all dynamic text paths', function () {
            var frame = new Wick.Frame();

            var path = TestUtils.paperToWickPath(new paper.Path.Rectangle({
                fillColor: 'red',
                to: new paper.Point(0,0),
                from: new paper.Point(100,100),
            }));
            var text = TestUtils.paperToWickPath(new paper.PointText({
                content: 'foo'
            }));
            var dynamicText1 = TestUtils.paperToWickPath(new paper.PointText({
                content: 'foo'
            }));
            dynamicText1.identifier = 'dynamicText1';
            var dynamicText2 = TestUtils.paperToWickPath(new paper.PointText({
                content: 'bar'
            }));
            dynamicText2.identifier = 'dynamicText2';
            var dynamicText3 = TestUtils.paperToWickPath(new paper.PointText({
                content: 'baz'
            }));
            dynamicText3.identifier = 'dynamicText3';

            frame.addPath(path);
            frame.addPath(text);
            frame.addPath(dynamicText1);
            frame.addPath(dynamicText2);
            frame.addPath(dynamicText3);

            expect(frame.dynamicTextPaths.length).to.equal(3);
            expect(frame.dynamicTextPaths[0]).to.equal(dynamicText1);
            expect(frame.dynamicTextPaths[1]).to.equal(dynamicText2);
            expect(frame.dynamicTextPaths[2]).to.equal(dynamicText3);
        })
    });

    describe('#distanceFrom', function () {
        it('should calculate distance correctly', function () {
            var frame = new Wick.Frame({start:5, end:5});
            expect(frame.distanceFrom(1)).to.equal(4);
            expect(frame.distanceFrom(2)).to.equal(3);
            expect(frame.distanceFrom(3)).to.equal(2);
            expect(frame.distanceFrom(4)).to.equal(1);
            expect(frame.distanceFrom(5)).to.equal(0);
            expect(frame.distanceFrom(6)).to.equal(1);
            expect(frame.distanceFrom(7)).to.equal(2);
            expect(frame.distanceFrom(8)).to.equal(3);
            expect(frame.distanceFrom(9)).to.equal(4);
        });

        it('should calculate distance correctly (extended frame)', function () {
            var frame = new Wick.Frame({start:5, end:10});
            expect(frame.distanceFrom(1)).to.equal(4);
            expect(frame.distanceFrom(2)).to.equal(3);
            expect(frame.distanceFrom(3)).to.equal(2);
            expect(frame.distanceFrom(4)).to.equal(1);
            expect(frame.distanceFrom(5)).to.equal(0);
            expect(frame.distanceFrom(6)).to.equal(0);
            expect(frame.distanceFrom(7)).to.equal(0);
            expect(frame.distanceFrom(8)).to.equal(0);
            expect(frame.distanceFrom(9)).to.equal(0);
            expect(frame.distanceFrom(10)).to.equal(0);
            expect(frame.distanceFrom(11)).to.equal(1);
            expect(frame.distanceFrom(12)).to.equal(2);
            expect(frame.distanceFrom(13)).to.equal(3);
            expect(frame.distanceFrom(14)).to.equal(4);
        });
    })

    describe('#getLinkedAssets', function () {
        it('should return the sound', function () {
            var project = new Wick.Project();
            var frame = new Wick.Frame({start: 2});
            project.activeLayer.addFrame(frame);

            // Add a sound to the frame:
            var soundAsset = new Wick.SoundAsset({
                filename: 'test.wav',
                src: TestUtils.TEST_SOUND_SRC_WAV
            });
            project.addAsset(soundAsset);
            frame.sound = soundAsset;

            expect(frame.getLinkedAssets().length).to.equal(1);
            expect(frame.getLinkedAssets()[0]).to.equal(soundAsset);
        });
    });

    describe('#importSVG', function () {
        it('should import SVGs correctly', function () {
            var project = new Wick.Project();
            var frame = new Wick.Frame({start: 2});

            frame.importSVG(TestUtils.TEST_SVG_CIRCLE);

            expect(frame.paths.length).to.equal(1);
            expect(frame.paths[0].bounds.width).to.equal(100);
            expect(frame.paths[0].bounds.height).to.equal(100);
        });

        it('(bug) imported paths should be converted from shapes to paths', function () {
            var project = new Wick.Project();
            var frame = new Wick.Frame({start: 2});

            frame.importSVG(TestUtils.TEST_SVG_CIRCLE);

            expect(frame.paths.length).to.equal(1);
            expect(frame.paths[0].view.item instanceof paper.Path).to.equal(true);
        });
    });

    describe('#length', function () {
        it('length should be able to be set', function () {
            var project = new Wick.Project();
            project.activeFrame.length = 3;
            expect(project.activeFrame.start).to.equal(1);
            expect(project.activeFrame.end).to.equal(3);
        });

        it('length should not be allow to be set to 0', function () {
            var project = new Wick.Project();
            project.activeFrame.length = 3;
            expect(project.activeFrame.start).to.equal(1);
            expect(project.activeFrame.end).to.equal(3);

            project.activeFrame.length = 0;
            expect(project.activeFrame.start).to.equal(1);
            expect(project.activeFrame.end).to.equal(1);
        });
    });

    describe('#cut', function () {
        it('should cut frame correctly', function () {
            var project = new Wick.Project();
            project.activeFrame.remove();

            var frameToCut = new Wick.Frame({start: 1, end: 10, identifier: 'frameToCut'});
            project.activeLayer.addFrame(frameToCut);
            frameToCut.addClip(new Wick.Clip({identifier: 'childShouldBeCopied'}));

            project.activeTimeline.playheadPosition = 6;
            frameToCut.cut();

            expect(project.activeLayer.frames.length).to.equal(2);
            expect(project.activeLayer.getFrameAtPlayheadPosition(1)).to.equal(frameToCut);
            expect(project.activeLayer.getFrameAtPlayheadPosition(1).identifier).to.equal('frameToCut');
            expect(project.activeLayer.getFrameAtPlayheadPosition(1).length).to.equal(5);
            expect(project.activeLayer.getFrameAtPlayheadPosition(6).identifier).to.equal(null);
            expect(project.activeLayer.getFrameAtPlayheadPosition(6).length).to.equal(5);
        });
    });

    describe('#insertBlankFrame', function () {
        it('should insert a blank frame', function () {
            var project = new Wick.Project();
            project.activeFrame.remove();

            var frameToCut = new Wick.Frame({start: 1, end: 10, identifier: 'frameToCut'});
            project.activeLayer.addFrame(frameToCut);
            frameToCut.addClip(new Wick.Clip({identifier: 'childShouldBeCopied'}));

            project.activeTimeline.playheadPosition = 6;
            frameToCut.insertBlankFrame();

            expect(project.activeLayer.frames.length).to.equal(3);
            expect(project.activeLayer.getFrameAtPlayheadPosition(1)).to.equal(frameToCut);
            expect(project.activeLayer.getFrameAtPlayheadPosition(1).identifier).to.equal('frameToCut');
            expect(project.activeLayer.getFrameAtPlayheadPosition(1).length).to.equal(5);
            expect(project.activeLayer.getFrameAtPlayheadPosition(6).identifier).to.equal(null);
            expect(project.activeLayer.getFrameAtPlayheadPosition(7).identifier).to.equal(null);
            expect(project.activeLayer.getFrameAtPlayheadPosition(7).length).to.equal(4);
        });

        it('should add blank frame but not cut frame if the parent playhead is not in range', function () {
            var project = new Wick.Project();
            project.activeFrame.remove();

            var frameToCut = new Wick.Frame({start: 1, end: 10, identifier: 'frameToCut'});
            project.activeLayer.addFrame(frameToCut);
            frameToCut.addClip(new Wick.Clip({identifier: 'childShouldBeCopied'}));

            project.activeTimeline.playheadPosition = 11;
            frameToCut.insertBlankFrame();

            expect(project.activeLayer.frames.length).to.equal(2);
            expect(project.activeLayer.getFrameAtPlayheadPosition(1)).to.equal(frameToCut);
            expect(project.activeLayer.getFrameAtPlayheadPosition(1).identifier).to.equal('frameToCut');
            expect(project.activeLayer.getFrameAtPlayheadPosition(11)).to.not.equal(frameToCut);
            expect(project.activeLayer.getFrameAtPlayheadPosition(11).length).to.equal(1);
        });
    });

    describe('#extendAndPushOtherFrames', function () {
        it('should extend a frame and push other frames', function () {
            var project = new Wick.Project();
            project.activeFrame.remove();

            var frame1 = new Wick.Frame({start: 1, end: 1, identifier: 'frame1'});
            project.activeLayer.addFrame(frame1);
            var frame2 = new Wick.Frame({start: 2, end: 2, identifier: 'frame2'});
            project.activeLayer.addFrame(frame2);
            var frame3 = new Wick.Frame({start: 3, end: 10, identifier: 'frame3'});
            project.activeLayer.addFrame(frame3);
            var frame4 = new Wick.Frame({start: 11, end: 11, identifier: 'frame4'});
            project.activeLayer.addFrame(frame4);

            frame1.extendAndPushOtherFrames();

            expect(frame1.start).to.equal(1);
            expect(frame1.end).to.equal(2);
            expect(frame2.start).to.equal(3);
            expect(frame2.end).to.equal(3);
            expect(frame3.start).to.equal(4);
            expect(frame3.end).to.equal(11);
            expect(frame4.start).to.equal(12);
            expect(frame4.end).to.equal(12);
        });
    });

    describe('#shrinkAndPullOtherFrames', function () {
        it('should shrink a frame and pull other frames', function () {
            var project = new Wick.Project();
            project.activeFrame.remove();

            var frame1 = new Wick.Frame({start: 1, end: 5, identifier: 'frame1'});
            project.activeLayer.addFrame(frame1);
            var frame2 = new Wick.Frame({start: 6, end: 6, identifier: 'frame2'});
            project.activeLayer.addFrame(frame2);
            var frame3 = new Wick.Frame({start: 7, end: 10, identifier: 'frame3'});
            project.activeLayer.addFrame(frame3);
            var frame4 = new Wick.Frame({start: 11, end: 11, identifier: 'frame4'});
            project.activeLayer.addFrame(frame4);

            frame1.shrinkAndPullOtherFrames();

            expect(frame1.start).to.equal(1);
            expect(frame1.end).to.equal(4);
            expect(frame2.start).to.equal(5);
            expect(frame2.end).to.equal(5);
            expect(frame3.start).to.equal(6);
            expect(frame3.end).to.equal(9);
            expect(frame4.start).to.equal(10);
            expect(frame4.end).to.equal(10);
        });
    });
});
