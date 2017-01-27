jQuery(document).ready(function($) {

    var oQueryParams = createQueryObject();
    var myCodeMirror;
    var aUserObejcts;
    var aQueryData = {
        aResults: [
            { Id: "a0690000015DLV0AAO", Name: "C-00005", attributes: { type: "Candidate__c", url: "/services/data/v37.0/sobjects/Candidate__c/a0690000015DLV0AAO" } },
            { Id: "a0690000015DLSDAA5", Name: "C-00006", attributes: { type: "Candidate__c", url: "/services/data/v37.0/sobjects/Candidate__c/a0690000015DLV0AAO" } },
            { Id: "a0690000015DLSDAA6", Name: "C-00007", attributes: { type: "Candidate__c", url: "/services/data/v37.0/sobjects/Candidate__c/a0690000015DLV0AAO" } },
            { Id: "a0690000015DLSDAA7", Name: "C-00008", attributes: { type: "Candidate__c", url: "/services/data/v37.0/sobjects/Candidate__c/a0690000015DLV0AAO" } }
        ],
        apiLimit: 15000,
        apiUsed: 77,
        iRecords: 4,
        iTotal: 3,
        version: "0.1.1"
    };
    var oUser = {
        aSources: []
    };

    initialiseTaskSource();

    ajaxGetUserObjects();

    if (aDataObjects) {
        storeUserObjects(aDataObjects, function(err, bResult) {
            if (bResult) {
                console.log('UserObjects Preload Successful!');
            }
        });
    }

    /* - Source Loader System - */
    function initialiseTaskSource() {
        //Triggers "New Source" Selection panel to appear
        $('.chooseBtn.newSource').on('click', function() {
            var sType = $(this).attr('data-type').trim();
            console.log('Create New ' + sType + ' Source');
            openChooseSourcePanel(sType);
        });

        //Trigger Selection Confirmation
        $('.chooseBtn.taskSourceBtn').on('click', function() {
            //Which Option did they select?
            var sSource = $(this).attr('data-source').trim();
            var sType = $(this).parents('.chooseSource').attr('data-type').trim();
            switch (sSource) {
                case 'soql':
                    configureSoqlQuery(sType);
                    break;
                case 'file':
                    configureSourceFile(sType);
                    break;
            }
        });

        //Trigger Wizard Start
        $(document).on('click', '.chooseBtn.openWizardBtn', function() {
            $(this).hide();
            $('.chooseBtn.closeWizardBtn').show();
            openSoqlQueryWizard();
        });
        $(document).on('click', '.chooseBtn.closeWizardBtn', function() {
            $(this).hide();
            $('.chooseBtn.openWizardBtn').show();

            closeSoqlQueryWizard();
        });

        //Open QueryEditing on Object Selection
        $(document).on('change', '#queryObjectField', function() {
            var sText = $(this).find('option:selected').text();
            var sType = $(this).attr('data-type').trim();

            console.log('User Has Chosen: ' + sText + ' From ' + sType + ' source');

            //Add Confirmation text
            var sHtml = '<input type="button" data-type="' + sType + '" class="chooseBtn selectObjectBtn" value="Go" />';
            $('.taskPanel.sourcePanel.' + sType + 'Source').find('.queryObjectConfirmWrap').empty().append(sHtml);
        });

        //Add selected field to query
        $(document).on('change', '#queryFields', function() {
            var eSelected = $(this).find('option:selected');

            var aFields = [];
            $('#queryFields :selected').each(function(i, selected) {
                aFields.push($(selected).attr('id'));
            });

            //Add field to query
            updateQueryObject({ fields: aFields });
        });

        //Retrieve Fields for Chosen Object
        $(document).on('click', '.sourcePanel .selectObjectBtn', function() {
            var sType = $(this).attr('data-type').trim();
            var ePanel = $('.taskPanel.sourcePanel.' + sType + 'Source');
            var oSelect = ePanel.find('#queryObjectField');
            var sObject = oSelect.find('option:selected').attr('id');

            //Update QUery With Chosen Object
            ePanel.find('tbody.hide').removeClass('hide');

            //Get Object Fields
            ajaxGetObjectFields(sType, sObject);
        });

        //Toggle Source Panel
        $(document).on('click', '.taskPanelToggle', function() {
            var ePanel = $(this).parents('.taskPanel');
            toggleTaskPanel(ePanel);
        });

        //OrderBy Field has been chosen
        $(document).on('change', '#queryOrderByField', function() {
            var eSelected = $(this).find('option:selected');
            if (eSelected.attr('id').length <= 0) {
                return false;
            }

            var sOrderBy = eSelected.attr('id').trim();

            //Add field to query
            updateQueryObject({ orderby: sOrderBy });
        });

        //Sort Query Nulls
        $(document).on('change', '#taskImport #queryNullsField', function() {
            var eSelected = $(this).find('option:selected');
            var sNulls = null;
            if (typeof eSelected !== 'undefined' && eSelected.attr('value').length > 0) {
                sNulls = eSelected.attr('value');
            }

            console.log('Update nulls to :' + sNulls);
            //Add field to query
            updateQueryObject({ nulls: sNulls });
        });

        //Add Limit
        $(document).on('focusout', '#taskImport #queryLimitField', function() {
            var sLimit = null;
            if ($(this).val().length > 0) {
                sLimit = $(this).val().trim();
            }

            //Add field to query
            updateQueryObject({ limit: sLimit });
        });

        //Toggle Btn Group Selections
        $(document).on('click', '#taskImport .btn-group .btn', function() {
            console.log('Clicked btn Group Btn');
            var eThis = $(this);
            var eGroup = $(this).parents('.btn-group');
            eGroup.find('.btn').addClass('selected');
            eThis.removeClass('selected');

            updateQueryOrder();
        });

        //Select All Fields
        $(document).on('click', '#taskImport #selectAllObjectFieldsBtn', function() {
            $('#queryFields option').prop('selected', true);
            $('#queryFields').change();
        });

        //Validate Query
        $(document).on('click', '.chooseBtn.validateQueryBtn', function() {
            validateQuery();
        });


        //Run Query
        $(document).on('click', '.chooseBtn.runQueryBtn', function() {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            console.log('Run Query Button Clicked!');
            runQuery();
        });

        //Toggle Export Data screen
        $(document).on('click', '.chooseBtn.confirmResultDataBtn', function() {
            confirmDataReview();
        });

        //Create New WHERE Connection LINK
        $(document).on('click', '.chooseBtn.addNewConnection', function() {
            var eBtn = $(this);
            var sType = eBtn.attr('data-type').trim();
            var sArg = eBtn.attr('data-arg').trim();

            console.log('--- Create New ' + sType + ' Connection (' + sArg + ') ---');

            var eWrap = $('#taskExport').find('.connectionWrap[data-type="' + sType + '"]');
            if (eWrap && eWrap.length > 0) {
                var eHtml = addExportConnectionHTML(sType, sArg);
                eWrap.append(eHtml);
                initiateDragDropComponents();
            }
        });

        //Remove Existing Connection Link
        $(document).on('click', '.connectionSeparator', function() {
            var eLink = $(this).parents('.connectionListItem');
            var iIndex = $(this).parents('.connectionListItem').index() - 1;

            $(this).parents('.connectionListItem').remove();
        });

        //Switch SF Export to INSERT||UPDATE||DELETE FORM
        $(document).on('click', '.chooseBtn.queryTypeFieldBtn', function() {
            $('.chooseBtn.queryTypeFieldBtn').removeClass('selected');
            $(this).addClass('selected');

            var sType = $(this).attr('data-type').trim();
            switchSalesForceObectForm(sType);
            initiateDragDropComponents();
        });

        //Verify All Export Object Connections are linked
        $(document).on('click', '.chooseBtn.validateExportFormBtn', function() {
            validateSalesForceExportForm();
        });

        //Confirm Export Object
        $(document).on('click', '.chooseBtn.confirmExportBtn', function() {
            confirmExportObject();
        });
    }

    function openChooseSourcePanel(sType) {
        var ePanel = $('.chooseSource.choosePanel[data-type="' + sType + '"]');
        ePanel.show();
        ePanel.fadeTo(200, 1);
    }

    function closeAddTaskInputSource(sType, callback) {
        var ePanel = $('.chooseSource.choosePanel[data-type="' + sType + '"]');

        ePanel.fadeTo(200, 0, function() {
            ePanel.hide();

            return callback(null, true);
        });
    }


    function toggleTaskPanel(ePanel) {

        var eGlyph = ePanel.find('.taskPanelToggle').find('i');
        if (eGlyph.hasClass('glyphicon-minus')) {
            eGlyph.removeClass('glyphicon-minus');
            eGlyph.addClass('glyphicon-cog');

            ePanel.find('.panel-body').hide();
        } else {
            eGlyph.addClass('glyphicon-minus');
            eGlyph.removeClass('glyphicon-cog');

            ePanel.find('.panel-body').show();
        }
    }

    function configureSoqlQuery(sType) {
        //Step 1 - Close selection screen, Confirm SF Soql as source
        closeAddTaskInputSource(sType, function(err, done) {
            if (err) return false;

            if (done) {
                if (sType == 'import') {
                    addSourceItem('soql');
                    startCodeMirrorWindow();
                } else if (sType == 'export') {
                    $('.exportsConfig').find('.templateTarget').hide();
                    addNewExportSoqlPanel();
                }
            }
        });
    }

    function addNewExportSoqlPanel() {
        var ePanel = $('#taskExport');
        ePanel.find('.exportData.sourceType').empty().append('SalesForce Object');

        var eForm = $('#exportsObjectForm');
        ePanel.find('.panel-body').empty().append(eForm.html());

        generateExportObjectSelect();
        createExportResultFieldList();

        $('#taskExport').show();
    }

    function openSoqlQueryWizard() {
        //Step 1 - Begin SOQL configuration
        $('#taskImport').find('#query_form').show();

        if (aUserObejcts) {
            generateObjectSelect();
        } else {
            //Step 2 - Retrieve User Objects
            ajaxGetUserObjects();
        }
    }

    function closeSoqlQueryWizard() {
        $('#taskImport').find('#query_form').hide();
    }


    function addSourceItem(sType) {
        var sLabel = getSourceLabel(sType);

        var sHtml = '<div id="taskImport" data-id="1" class="taskPanel sourcePanel inputSource soqlSource panel panel-warning">';
        sHtml += '<div class="panel-heading">';
        sHtml += '<span>';
        sHtml += '<div class="taskPanelGlyphBtn sourcePanelStatus" title="Unconfirmed Source"><i class="glyphicon glyphicon-alert"></i></div>';
        sHtml += 'Source: <label>' + sLabel + '</label>'; //<span class="switchSourceType">change...</span>';
        sHtml += '</span>';
        sHtml += '<span class="pull-right">';
        sHtml += '<div class="taskPanelGlyphBtn taskPanelToggle" alt="Minimize Source Panel"><i class="glyphicon glyphicon-minus"></i></div>';
        sHtml += '<div class="taskPanelGlyphBtn sourcePanelDelete" alt="Remove this source from Task"><i class="glyphicon glyphicon-remove"></i></div>';
        sHtml += '</span>';
        sHtml += '</div>';
        sHtml += '<div class="panel-body">';
        sHtml += '<div class="row">';
        sHtml += '<div class="soqlItem queryItem">';
        sHtml += '<div class="col-xs-9">';
        sHtml += '<div id="codeMirrorWindow"></div>';
        sHtml += '</div>';
        sHtml += '<div class="col-xs-3">';
        sHtml += '<input type="button" class="chooseBtn btn-block validateQueryBtn" value="Validate" />';
        sHtml += '<input type="button"class="chooseBtn btn-block runQueryBtn disabled" value="Run Query" />';
        sHtml += '<span class="sourceStatus"><i class="sourceLoadingGif"></i></span>';
        sHtml += '</div>';
        sHtml += '</div>';
        sHtml += '</div>';
        sHtml += '<div class="row">';
        sHtml += '<div class="col-xs-12">';
        sHtml += '<p>Need Help? Our Query wizard can help you setup basic SOQL Queries</p>';
        sHtml += '<input type="button" class="chooseBtn openWizardBtn" value="Use Wizard" />';
        sHtml += '<input type="button" style="display:none;"class="chooseBtn closeWizardBtn" value="Hide Wizard" />';
        sHtml += '</div>';
        sHtml += '</div>';
        sHtml += '<p style="display:none;" class="loading">Loading Your SOQL Configuration...</p>';
        sHtml += '</div>';
        sHtml += '</div>';
        sHtml += '</div>';

        $('.importSources').empty().append(sHtml);
        getSoqlQueryForm();
    }

    function getSourceLabel(sType) {
        var sLabel = 'Default Label';
        switch (sType) {
            case 'soql':
                sLabel = 'SalesForce SOQL Query';
                break;
            case 'file':
                sLabel = 'Uploaded File';
                break;
        }

        return sLabel;
    }

    function generateObjectSelect() {
        var sSelect = '<option id="">Select an sObject:</option>';
        if (aUserObejcts) {
            $.each(aUserObejcts, function(key, sObject) {
                sSelect += '<option id="' + sObject.name + '">' + sObject.label + '</option>';
            });
        }

        var oTask = $('#taskImport');
        oTask.find('.loading').hide();
        oTask.find('#queryObjectField').empty().append(sSelect);
        oTask.find('#queryObjectField').select2();
    }

    function generateExportObjectSelect() {
        var sSelect = '<option id="">Select an sObject:</option>';
        if (aUserObejcts) {
            $.each(aUserObejcts, function(key, sObject) {
                sSelect += '<option id="' + sObject.name + '">' + sObject.label + '</option>';
            });
        }

        var oTask = $('#taskExport');

        oTask.find('#queryObjectField').empty().append(sSelect);
        oTask.find('#queryObjectField').select2();

        oTask.find('#queryObjectField').attr('disabled', null);

    }

    function generateResultDropItems() {
        var aResults = aQueryData.aResults;

        var aFields = [];
        var aGridFields = [];
        if (aResults.length > 0) {
            aFields = Object.keys(aResults[0]);
        }

        console.log('raw fields');
        console.log(aFields);

        var iAttr = aFields.indexOf("attributes");
        if (iAttr >= 0) {
            aFields.splice(iAttr, 1);
        }

        console.log('processed');
        console.log(aFields);

        var aItems = [];

        if (aFields.length > 0) {
            for (var i = 0; i < aFields.length; ++i) {
                var sItem = '';
                var sName = aFields[i].trim();
                sItem += '<div class="dropField resultField" data-name="' + sName + '">';
                sItem += '<span>' + aFields[i] + '</span>';
                sItem += '</div>';

                aItems.push(sItem);
            }
        }
        return aItems;
    }

    function generateTargetDropItems(sName, aFields) {

        var aItems = [];

        if (aFields.length > 0) {
            for (var i = 0; i < aFields.length; ++i) {
                var bPk = aFields[i].name == 'Id' ? true : false;

                var sPk = bPk ? '<i class="glyphicon glyphicon-tag" title="Object ID Field"></i>' : '';
                var edit = (aFields[i].updateable == false || bPk) ? '<i class="glyphicon glyphicon-floppy-remove" title="Cannot Edit This Field"></i>' : '';

                var sItem = '';
                sItem += '<div class="dropField targetField" data-name="' + aFields[i].name + '">';
                sItem += '<span>' + aFields[i].name + '</span>';
                sItem += sPk + edit;
                sItem += '</div>';
                aItems.push(sItem);
            }
        }
        return aItems;
    }

    function createExportResultFieldList() {
        //Create Draggable Field Items
        var aFields = generateResultDropItems();
        var oTask = $('#taskExport');
        oTask.find('.dataResults').empty().append(aFields.join(''));

        initiateDragDropComponents();
    }

    function testExports() {
        openExportcongfig();
    }

    //testExports();

    //Check if Query Passes Validation
    function validateQuery() {
        if (isValidQuery()) {
            $('#taskImport').find('.runQueryBtn').removeClass('disabled');
            $('.sourceStatus').empty().append('<div class="alert alert-success" role="alert">Your query is valid. You can now run the query and confirm this task source</div>');
            return true;
        }

        $('.sourceStatus').empty().append('<div class="alert alert-danger" role="alert">Your query is invalid</div>');
        return false;
    }

    function isValidQuery() {
        return true;
    }

    function runQuery() {
        resetReviewDataPanel();
        $('#taskImport').find('.sourceStatus').empty();
        $('#taskImport').find('.sourcePanelStatus').find('i').removeClass('glyphicon-alert').addClass('glyphicon-hourglass');
        //Step 1 - Get Query
        var sQuery = myCodeMirror.doc.getValue();
        console.log('Raw Output of CodeWindow:');
        console.log(sQuery.trim());

        //Step 2 - Validate Query
        console.log('Validating Query...');
        if (!validateQueryString(sQuery)) {
            console.log('Error: Invalid Query String');
            return false;
        }

        console.log('Query Valid!');
        ajaxRunQuery(sQuery, function(err, oData) {
            if (err) {
                console.log('Run Query Error: ' + err);
                $('#taskImport').find('.sourcePanelStatus').find('i').removeClass('glyphicon-hourglass').addClass('glyphicon-alert');
                return false;
            }

            console.log('Run Query Success');

            $('#taskImport').find('.sourcePanelStatus').find('i').removeClass('glyphicon-hourglass').addClass('glyphicon-ok');
            $('#taskImport').removeClass('panel-warning').addClass('panel-success');
            toggleTaskPanel($('#taskImport'));

            //Push Results to front end
            aQueryData = oData;

            updateQueryObject({ fields: aQueryData.aFields });
            //Ajax Query Success
            displayRunQuerySuccess();
        });
    }

    function validateQueryString(sQuery) {
        if (typeof sQuery !== 'undefined' && sQuery.length > 0) {
            return true;
        }

        return false;
    }

    function resetReviewDataPanel() {
        $('#taskReview').removeClass('panel-success').addClass('panel-warning');
        $('#taskReview').find('.reviewPanelStatus').find('i').removeClass('glyphicon-ok').addClass('glyphicon-alert');

        $('.resultsConfig').find('.resultsData.totalRows').empty();
        $('#taskReview').hide();
    }

    function displayRunQuerySuccess() {
        closeSoqlQueryWizard();
        //Update Progress
        $('.taskProgressWrap').find('.step1').removeClass('doing').addClass('done');
        $('.taskProgressWrap').find('.step2').addClass('doing');
        $('#taskReview').hide();
        var eResultTable = $('.resultsConfig').find('#resultsTable');

        eResultTable.empty();
        if (aQueryData && aQueryData.iRecords > 0) {

            $('.resultsConfig').find('.resultsData.totalRows').empty().append(aQueryData.iTotal);
            $('#taskReview').show();
            //Generate Rows Selection Table
            createResultsGridTable(eResultTable);
        } else {
            $('.resultsConfig').find('.resultsData.totalRows').empty().append(aQueryData.iTotal);
        }

        $('.configs.resultsConfig').show();
    }

    function confirmDataReview() {
        var ePanel = $('#taskReview');
        ePanel.removeClass('panel-warning').addClass('panel-success');
        ePanel.find('.reviewPanelStatus').find('i').removeClass('glyphicon-alert').addClass('glyphicon-ok');
        //Minimize Review Panel
        toggleTaskPanel(ePanel);
        //Display Export Panel
        openExportcongfig();
    }

    function openExportcongfig() {
        $('.taskProgressWrap').find('.step2').removeClass('doing').addClass('done');
        $('.taskProgressWrap').find('.step3').addClass('doing');

        //Open Step 3
        $('.configs.exportsConfig').show();
    }

    function confirmExportObject() {
        var ePanel = $('#taskExport');
        ePanel.removeClass('panel-warning').addClass('panel-success');
        ePanel.find('.reviewPanelStatus').find('i').removeClass('glyphicon-alert').addClass('glyphicon-ok');
        //Minimize Review Panel
        toggleTaskPanel(ePanel);
        //Display Export Panel
        openSaveTaskPanel();
    }

    function openSaveTaskPanel() {
        $('.taskProgressWrap').find('.step3').removeClass('doing').addClass('done');

        //Open Step 3
        $('.configs.saveTaskConfig').show();
    }

    function getFieldsResultsList() {
        var aResults = aQueryData.aResults;

        var aFields = [];
        var aGridFields = [];
        if (aResults.length > 0) {
            aFields = Object.keys(aResults[0]);
        }

        var iAttr = aFields.indexOf("attributes");
        if (iAttr >= 0) {
            aFields.splice(iAttr, 1);
        }

        for (var i = 0; i < aFields.length; i++) {
            var oField = {
                Field: aFields[i]
            };
            aGridFields.push(oField);
        }

        return aGridFields;
    }

    function createResultsGridTable(eTable) {
        var aFields = generateFieldData();
        var aResults = generateResultData(aFields);

        eTable.jsGrid({
            height: "auto",
            width: "100%",

            sorting: true,
            paging: false,
            pageIndex: 1,
            pageSize: 20,

            data: aResults,
            fields: aFields,
        });
    }

    function testgrid() {
        var eTable = $('.resultsConfig').find('#resultsTable');
        eTable.empty();

        createResultsGridTable(eTable);
    }

    // testgrid();

    function generateFieldData() {
        var aGridFields = [];
        var aFields = oQueryParams.fields;

        var iWidth = 100 / aFields.length;

        for (var i = 0; i < aFields.length; i++) {
            var oField = {
                name: aFields[i],
                type: 'text'
            };
            aGridFields.push(oField);
        }

        return aGridFields;
    }

    function generateResultData(aFields) {

        var aGridResults = [];

        if (typeof aQueryData != 'undefined') {
            if (typeof aQueryData.aResults != 'undefined') {
                var aResults = aQueryData.aResults;

                for (var i = 0; i < aResults.length; i++) {
                    aGridResults.push(aResults[i]);
                }

            }
        }
        return aGridResults;
    }

    function addObjectFieldsToExportObject(sObject) {
        var aFields = generateTargetDropItems(sObject.name, sObject.fields);

        $('#taskExport').find('.targetFields').empty().append(aFields.join(''));

        initiateDragDropComponents();
    }

    function startCodeMirrorWindow() {
        var eWindow = document.getElementById('codeMirrorWindow');

        var sQuery = generateQueryString();

        myCodeMirror = CodeMirror(eWindow, {
            value: sQuery,
            mode: "javascript",
            theme: "monokai",
            lineNumbers: true
        });
    }

    function createQueryObject() {
        return {
            type: 'SELECT',
            fields: ['Id', 'Name', 'CreatedDate', 'City__c'],
            object: 'Candidate__c',
            orderby: null,
            order: 'ASC',
            limit: null,
            nulls: null
        }
    }

    function updateQueryOrder() {
        //Sort Field Selected?
        var eOrderBy = $('#queryOrderByField');
        if (eOrderBy.find('option:selected').attr('id').length > 0) {
            var sOrderBy = eOrderBy.find('option:selected').attr('id');
            var sOrder = $('#queryOrderField').find('.selected').text();

            updateQueryObject({
                orderby: sOrderBy,
                order: sOrder
            });
        }
    }

    function updateQueryObject(oParams) {
        console.log('Update Query');
        var oUpdated = oQueryParams;
        $.extend(oUpdated, oParams);
        oQueryParams = oUpdated;

        console.log('New Params:');
        console.log(oUpdated);

        setCodeMirrorValue();
    }

    function generateQueryString() {
        var oQuery = oQueryParams;
        var sFields = '';

        //Add Field Queries
        $.each(oQuery.fields, function(key, sField) {
            sFields += key <= 0 ? sField : ', ' + sField;
        });

        //Add Order By String
        var sOrderBy = '';
        if (oQuery.orderby) {
            sOrderBy = 'ORDER BY ' + oQuery.orderby + ' ' + oQuery.order;
        }

        //Add Nulls Order
        var sNulls = '';
        if (oQuery.nulls) {
            sNulls = 'NULLS ' + oQuery.nulls;
        }

        //Add Limit String
        var sLimit = '';
        if (oQuery.limit) {
            sLimit = 'LIMIT ' + oQuery.limit;
        }

        //Generate Query
        var sQuery = oQuery.type + ' ' + sFields + ' FROM ' + oQuery.object + ' ' + sOrderBy + ' ' + sNulls + ' ' + sLimit;
        return sQuery;
    }

    function setCodeMirrorValue() {
        if (myCodeMirror) {

            var sQuery = generateQueryString();
            myCodeMirror.doc.setValue(sQuery);
        }
    }

    function getSoqlQueryForm() {
        var oForm = $('#soqlQueryForm');
        if (oForm.length > 0) {
            var eTask = $('#taskImport');
            if (eTask.find('#query_form').length > 0) {
                eTask.find('#query_form').remove();
            }

            $('#taskImport').append(oForm.html());
            $('#taskImport').find('#query_form').hide();
        }
    }

    function ajaxGetUserObjects() {
        $.ajax({
            url: '/api/objects/',
            method: 'get',
            dataType: 'json',
            beforeSend: function() {
                if (aUserObejcts) {
                    console.log('Already Have User Objects; Skip Ajax');
                    return false;
                }
                console.log('---ajax.getUserObjects.submit---');
            },
            error: function(jqXHR, sText, sThrown) {
                console.log('---ajax.getUserObjects.error---');
                console.log(jqXHR);
                console.log(sText);
                console.log(sThrown);

                //formError(sText);
                return false;
            },
            success: function(oData) {
                console.log('---ajax.getUserObjects.success---');
                console.log(oData);
                storeUserObjects(oData, function(err, bDone) {
                    if (bDone) {
                        generateObjectSelect();
                        generateExportObjectSelect();
                    }
                });
            }
        });

        return true;
    }

    function ajaxGetObjectFields(sType, sObject) {
        console.log('---ajax.getObjectDetails.submit---');

        updateQueryObject({ object: sObject, fields: [] });

        haveObejctFields(sObject, function(err, bResult) {
            if (!bResult) {
                $.ajax(getObjectDetailsSubmitAjax(sType, sObject));
            } else {
                console.log('Already Have this object fields stored; Skip Ajax');
                addObjectFieldstoSelect(sType, sObject);
            }
        });

        return true;
    }

    function getObjectDetailsSubmitAjax(sType, sObject) {
        return {
            url: '/api/objects/' + sObject,
            method: 'get',
            beforeSend: function() {
                if (sType == 'import') {
                    $('#taskImport').find('#queryFields').empty().append('<option id="" value="">Loading Object Fields...</option>');
                } else if (sType == 'export') {
                    $('#taskExport').find('.targetFields').find('em').text('...Loading Object Fields');
                }
            },
            error: function(jqXHR, sText, sThrown) {
                console.log('---ajax.getObjectDetails.error---');
                console.log(jqXHR);
                console.log(sText);
                console.log(sThrown);

                //formError(sText);
                return false;
            },
            success: function(oData) {
                console.log('---ajax.getObjectDetails.success---');
                console.log(oData);

                removeConfirmBtn();
                updateUserObject(oData, function(err, bResult) {
                    if (bResult) {
                        if (sType == 'import') {
                            addObjectFieldstoSelect(sType, oData.name);
                        } else if (sType == 'export') {
                            addObjectFieldsToExportObject(oData);
                        }
                    }
                });

            }
        };
    }

    function ajaxRunQuery(sQuery, callback) {
        var oParams = {
            sType: 'SELECT',
            sQuery: JSON.stringify(sQuery.trim())
        };

        console.log('---ajax.runSelectQuery.submit---');

        $.ajax({
            url: '/api/query/select',
            method: 'post',
            dataType: 'json',
            data: oParams,
            error: function(jqXHR, sText, sThrown) {
                console.log('---ajax.runSelectQuery.error---');
                console.log(jqXHR);
                console.log(sText);
                console.log(sThrown);

                //formError(sText);
                return callback(sTextm);
            },
            success: function(oData) {
                console.log('---ajax.runSelectQuery.success---');
                console.log(oData);
                return callback(null, oData);
            }
        });
    }

    function removeConfirmBtn() {
        $('.queryObjectConfirmWrap').empty();
    }

    function addObjectFieldstoSelect(sType, sName) {
        var aObjects = aUserObejcts;
        var aFields = [];
        if (aObjects) {
            for (var i = 0; i < aObjects.length; ++i) {
                if (aObjects[i].name == sName) {
                    aFields = aObjects[i].aFields;
                    break;
                }
            }
        }

        var ePanel = $('.taskPanel.sourcePanel.' + sType + 'Source');

        var eSelect = ePanel.find('#queryFields');
        var eSort = ePanel.find('#queryOrderByField');
        eSelect.select2();
        eSort.select2();

        if (typeof aFields != 'undefined' && aFields.length > 0) {
            for (var i = 0; i < aFields.length; ++i) {
                var sOption = '<option id="' + aFields[i].name + '">' + aFields[i].label + '</option>';
                eSelect.append(sOption);
                eSort.append(sOption);
            }
        } else {
            eSelect.append('<option id="" value="">Found 0 Fields on Object</option>');
            eSort.append('<option id="" value="">Found 0 Fields on Object</option>');
        }

        eSelect.attr('disabled', false);
        eSort.attr('disabled', false);

    }

    function haveObejctFields(sName, callback) {
        var bResult = false;
        if (aUserObejcts) {
            for (var i = 0; i < aUserObejcts.length; ++i) {
                if (aUserObejcts[i].name == sName) {
                    if (aUserObejcts[i].aFields.length > 0) {
                        bResult = true;
                        break;
                    }
                }

            }
        }

        return callback(null, bResult);
    }

    function storeUserObjects(oResult, callback) {
        if (!aUserObejcts) {
            var oObjects = [];

            $.each(oResult.sObjects, function(key, sObject) {
                var oNew = {
                    name: sObject.name,
                    label: sObject.label,
                    aFields: []
                };
                oObjects.push(oNew);
            });

            aUserObejcts = oObjects;
        }

        return callback(null, true);
    }

    function updateUserObject(oResult, callback) {
        if (aUserObejcts) {
            for (var i = 0; i < aUserObejcts.length; ++i) {
                if (aUserObejcts[i].name == oResult.name) {
                    var oNew = aUserObejcts[i];
                    oNew.aFields = oResult.aFields;

                    aUserObejcts[i] = oNew;
                    break;
                }
            }
        }

        return callback(null, true);
    }

    $(document).on('click', '.validateQueryBtn', function() {
        initiateNewSource(function(bStatus, iSource) {
            if (!bStatus) return false;
            console.log('Created New Source:' + iSource);
            console.log(oUser);
        });
    });

    function initiateNewSource(callback) {
        var oSource = new SourceBuilder;
        if (typeof oSource.source.id == 'undefined') return callback(false);
        return callback(true, oSource.source.id);
    }

    function SourceBuilder() {
        this.source = new Source;

        this.init = function() {
            if (oUser) {
                console.log('# sources: ' + oUser.aSources.length);
                if (oUser.aSources && oUser.aSources.length >= 1) {
                    console.log('Warning: Cannot have more than one Source in a Task.');
                    return false;
                }
            }
            this.source.id = this.createId();
            this.addToUser();
            console.log('Source #' + this.id + ' Created ' + this.iCreated);
        };

        this.beginWizard = function() {
            console.log('Begin Wizard');
            return true;
        }

        this.createId = function() {
            //Check If user has any Existing Soures
            if (!oUser.aSources || oUser.aSources.length <= 0) {
                return 0;
            }

            return oUser.aSources.length;
        }

        this.addToUser = function() {
            oUser.aSources.push(this.source);
        }

        this.init();
    };

    function Source() {
        this.id;
        this.sType = '';
        this.iCreated = new Date().getTime();
        this.meta = {};
    };


    function initiateDragDropComponents() {
        //Initiate Draggable Result Fields
        $("#taskExport").find('.resultField').draggable({
            revert: "invalid",
            revertDuration: 150,
            cursor: "pointer",
            helper: "clone",
            opacity: 1,
            scroll: true,
            scrollSensitivity: 100,
            scope: "resultField",
            zIndex: 200
        });

        //Initiate Draggable Target Fields
        $("#taskExport").find('.targetField').draggable({
            revert: "invalid",
            revertDuration: 150,
            cursor: "pointer",
            helper: "clone",
            opacity: 1,
            scroll: true,
            scrollSensitivity: 100,
            scope: "targetField",
            zIndex: 200
        });

        //Initiate Droppable Result Fields
        $('#taskExport').find('.resultConnection.empty').droppable({
            scope: "resultField",
            hoverClass: "highlight",
            tolerance: 'pointer',
            drop: function(event, ui) {
                var eLink = $(this);
                setDownDroppableField(eLink, ui.draggable, 'result');
            }
        });

        //Initiate Droppable Target Fields
        $('#taskExport').find('.targetConnection.empty').droppable({
            scope: "targetField",
            hoverClass: "highlight",
            tolerance: 'pointer',
            drop: function(event, ui) {
                var eLink = $(this);
                setDownDroppableField(eLink, ui.draggable, 'target');
            }
        });

    }

    function setDownDroppableField(eLink, eField, sType) {
        var sField = eField.attr('data-name').trim();
        console.log('--Dropped ' + sType + ' Item Onto Empty ' + sType + ' Link Field--');
        if (eLink && eLink.length > 0) {
            eLink.removeClass('ui-droppable');
            eLink.removeClass('empty');
            eLink.parents('.connectionListItem').attr('data-' + sType, sField);
            eLink.find('span').text(sField);
        }

        initiateDragDropComponents();
    }

    function switchSalesForceObectForm(sType) {
        var sForm = '';
        switch (sType) {
            case 'insert':
                sForm += addValuesConnectionSectionHTML();
                break;
            case 'update':
                sForm += addWhereConnectionSectionHTML();
                sForm += addValuesConnectionSectionHTML();
                break;
            case 'delete':
                sForm += addWhereConnectionSectionHTML();
                break;
        }

        var eForm = $('#taskExport').find('.exportObjectConnnectionWrap');
        if (eForm && eForm.length > 0) {
            eForm.empty().append(sForm);
        }
    }

    function validateSalesForceExportForm() {
        var eMsg = $('#taskExport').find('.exportValidateMsg');

        eMsg.removeClass('alert-success').removeClass('alert-warning').removeClass('alert-danger');

        var aItems = $('#taskExport').find('.exportObjectConnnectionWrap').find('.connectionListItem');
        console.log(aItems);
        if (aItems.length > 0) {
            var bFail = false;
            for (var i = 0; i < aItems.length; i++) {
                var oItem = $(aItems[i]);
                if (oItem.attr('data-result').length <= 0 || oItem.attr('data-target').length <= 0) {
                    console.log('This Connection (' + i + ') Is Missing Links ');
                    bFail = true;
                    break;
                }
            }

            if (bFail) {
                eMsg.addClass('alert-danger');
                eMsg.empty().append('Some Connections are yet to be completed');
                return false;
            }
        } else {
            eMsg.addClass('alert-danger');
            eMsg.empty().append('You have not Made Any Connections Yet');
            return false;
        }


        eMsg.addClass('alert-success');
        eMsg.empty().append('Export Connections are Valid');

        $('#taskExport').find('.submissionWrap').find('.confirmExportBtn').attr('disabled', null);

        return true;
    }


    function addWhereConnectionSectionHTML() {
        var sHtml = '';
        sHtml += '<h3>WHERE</h3>';
        sHtml += '<div class="connectionWrap" data-type="where">';
        sHtml += '<div class="connectionListItem whereItem" data-id="0" data-result="" data-target="Id">';
        sHtml += '<div class="dropField connectionField resultConnection empty">';
        sHtml += '<span>Drop A Source Field</span>';
        sHtml += '</div>';
        sHtml += '<div class="dropField connectionField targetConnection">';
        sHtml += '<span>Id</span>';
        sHtml += '</div>';
        sHtml += '</div>';
        sHtml += '</div>';
        sHtml += '<div class="newConnectionWrap text-center">';
        sHtml += '<input type="button" class="chooseBtn addNewConnection" data-type="where" data-arg="and" value="and" />';
        sHtml += '</div>';

        return sHtml;
    }

    function addValuesConnectionSectionHTML() {
        var sHtml = '';
        sHtml += '<h3>VALUES</h3>';

        sHtml += '<div class="connectionWrap" data-type="value">';
        sHtml += '<div class="connectionListItem valueItem" data-id="0" data-result="" data-target="">';
        sHtml += '<div class="dropField connectionField resultConnection empty">';
        sHtml += '<span>Drop A Source Field</span>';
        sHtml += '</div>';
        sHtml += '<div class="dropField connectionField targetConnection empty">';
        sHtml += '<span>Drop A Target Field</span>';
        sHtml += '</div>';
        sHtml += '</div>';
        sHtml += '</div>';
        sHtml += '<div class="newConnectionWrap text-center">';
        sHtml += '<input type="button" class="chooseBtn addNewConnection" data-type="value" data-arg="" value="+" />';
        sHtml += '</div>';


        return sHtml;
    }

    function addExportConnectionHTML(sType, sArg) {
        var sClass = sType == 'where' ? 'whereItem' : 'valueItem';
        var sHtml = '';

        sHtml += '<div class="connectionListItem ' + sClass + '" data-id="" data-result="" data-target="">';
        if (sType == 'where') {
            var sLabel = sArg == 'and' ? '-AND-' : '-OR-';
            sHtml += '<div class="andSeparator">' + sLabel + '</div>';
        }
        sHtml += '<div class="dropField connectionField resultConnection empty">';
        sHtml += '<span>Drop A Source Field</span>';
        sHtml += '</div>';
        sHtml += '<span class="connectionSeparator"><i class="glyphicon glyphicon-trash"></i></span>';
        sHtml += '<div class="dropField connectionField targetConnection empty">';
        sHtml += '<span>Drop A Target Field</span>';
        sHtml += '</div>';
        sHtml += '</div>';

        return sHtml;
    }

});
