(function($) {
  $.fn.goTo = function() {
    $('html, body').animate({
      scrollTop: $(this).offset().top + 'px'
    }, 'fast');
    return this; // for chaining...
  }
})(jQuery);

$(document).ready(function() {

  shortcut.add('F1', function() {
    location.href = '/cgi-bin/koha/catalogue/search.pl';
  });
  shortcut.add('F2', function() {
    location.href = '/cgi-bin/koha/members/members-home.pl';
  });
  shortcut.add('F3', function() {
    location.href = '/cgi-bin/koha/catalogue/itemsearch.pl#UB=barcode';
  });

  shortcut.add('F4', function() {
    location.href = '/cgi-bin/koha/circ/returns.pl#UB=barcode';
  });

  shortcut.add('F5', function() {
    location.href = '/cgi-bin/koha/members/members-home.pl';
  });

  shortcut.add('F6', function() {
    location.href = '/cgi-bin/koha/circ/renew.pl';
  });
  shortcut.add('F7', function() {
    location.href = '/cgi-bin/koha/tools/stage-marc-import.pl#UB=openupload';
  });

  shortcut.add('F8', function() {
    addItem();

  });

  shortcut.add('F9', function() {
    location.href = '/cgi-bin/koha/catalogue/search.pl#UB=searchtitle';
  });

  shortcut.add('F10', function() {
    location.href = '/cgi-bin/koha/serials/serials-home.pl';
  });

  shortcut.add('F11', function() {
    alert('pressed F11');
    if (location.pathname === '/cgi-bin/koha/members/memberentry.pl') {
      $('#saverecord').click();
    }
  });

  function addItem() {
    switch (location.pathname) {
      case '/cgi-bin/koha/catalogue/detail.pl':
      case '/cgi-bin/koha/catalogue/MARCdetail.pl':
      case '/cgi-bin/koha/catalogue/ISBDdetail.pl':
      case '/cgi-bin/koha/catalogue/moredetail.pl':
      case '/cgi-bin/koha/reserve/request.pl?':
      case '/cgi-bin/koha/catalogue/issuehistory.pl':
      case '/cgi-bin/koha/tools/viewlog.pl':
        var biblioNumber = getQueryVariable('biblionumber');
        var objectId = getQueryVariable('object')
        if (biblioNumber || objectId) {
          // we're in biblio view, make a new item and then break
          location.href = '/cgi-bin/koha/cataloguing/additem.pl?biblionumber=' + (biblioNumber || objectId) + '#additema';
          break;
        }
      default:
        location.href = '/cgi-bin/koha/catalogue/search.pl';
        break;
    }

  }

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
  }

  // F3
  if (location.pathname === "/cgi-bin/koha/catalogue/itemsearch.pl" &&
    location.hash === "#UB=barcode") {
    $('input[name="q"]').focus();
    $('input[name="q"]').parent().parent().goTo();
  }

  //F4
  if (location.pathname === '/cgi-bin/koha/circ/returns.pl' &&
    location.hash === "#UB=barcode") {
    $('input[name="q"]').focus();
    $('input[name="q"]').parent().parent().goTo();
  }
  //F9
  if (location.pathname === "/cgi-bin/koha/catalogue/search.pl" &&
    location.hash === "#UB=searchtitle") {
    $('fieldset#searchterms select').eq(0).val('ti,phr');
    $('fieldset#searchtermsinput[name="q"]').eq(0).focus();
  }


  //F10
  if (location.pathname === '/cgi-bin/koha/serials/serials-home.pl') {
    $('input#ISSN_filter').focus();
  }

  if (location.pathname === "/cgi-bin/koha/catalogue/itemsearch.pl" &&
    location.hash === "#UB=itemcallnumber") {
    $('select[name="f"]').val("itemcallnumber");
    $('input[name="q"]').focus();
    $('input[name="q"]').parent().parent().goTo();
  }

  if (location.pathname === "/cgi-bin/koha/catalogue/itemsearch.pl") {
    if ($('#results-wrapper').text().match(/\S+/)) {
      $('div#results-wrapper').goTo();
    }
  }


});

(function($) {
  /* Helpers */
  function ub_koha_set_select_value_by_option_text($select, text) {
    $select.find('option').filter(function() {
      return $(this).text().trim() === text;
    }).attr('selected', 'selected');
  }

  /* Main */
  $(function() {
    // Detect stage marc import page
    if ($('#tools_stage-marc-import').length) {
      // Set form values
      /*
      ub_koha_set_select_value_by_option_text(
        $('#marc_modification_template_id'),
        'TODO'
      );
      */
      ub_koha_set_select_value_by_option_text(
        $('#matcher'),
        'KohaBiblio (999$c)'
      );

      $('#format').val('Koha::Plugin::Se::Ub::Gu::MarcImport');
      $('#overlay_action').val('replace');
      $('#nomatch_action').val('create_new');
      $('#parse_itemsyes').attr('checked', 'checked'); //Deselect #parseitemsno?
      $('#item_action').val('always_add');

      // Hide elements where defaults should not be changed
      var hidden_elements = [];
      //hidden_elements.push($('#marc_modification_template_id').closest('fieldset').get(0));
      hidden_elements.push($('#format').closest('fieldset').get(0));
      hidden_elements.push($('#overlay_action').closest('fieldset').get(0));
      hidden_elements.push($('#parse_itemsyes').closest('fieldset').get(0));
      $(hidden_elements).hide();
    }
    // Detect manage marc import page
    else if ($('#tools_manage-marc-import').length) {
      // Set "Show all entities" as default
      // Possible race condition? Seems to work but does not feel
      // very robust
      dataTablesDefaults.iDisplayLength = -1;

      // Hide elements where defaults should not be changed
      if ($('#new_matcher_id').length) {
        var hidden_elements = [];
        hidden_elements.push($('#new_matcher_id').closest('li').get(0));
        hidden_elements.push($('#overlay_action').closest('li').get(0));
        hidden_elements.push($('#nomatch_action').closest('li').get(0));
        hidden_elements.push($('#item_action').closest('li').get(0));
        hidden_elements.push($('#staged-record-matching-rules .action').get(0));
        $(hidden_elements).hide();
      }
    }

    // detect 'receive shipment from vendor' page
    if ($('#acq_parcels').length) {
      //move html block
      $('#parcels_new_parcel').prependTo('#resultlist');
      //gather elements to hide
      $('#shipmentdate').parent().hide();
      $('#shipmentcost').parent().hide();
      $('#shipmentcost_budgetid').parent().hide();

    }
    //Detect invoice page
    if ($('#acq_invoices').length) {
      // hide colums on invoice page
      var table = $('#acq_invoices').find('#resultst');
      table.find('th').eq(4).hide();
      var numChildren = table.find('td').length;
      //Dont really like this solution, maybe check index of the TH instead...
      var td = 4;
      var tds = table.find('td');

      while (td < numChildren) {

        tds.eq(td).hide();
        td += 10;
      }
    }
    // New order modifications

    // Detect new order page
    if ($('#acq_neworderempty').length) {
      //hide form part
      $('form fieldset').eq(0).hide();
      //change quantity default value
      $('form fieldset #quantity').val(1);
    }

    // Detect "new basket page"
    if ($('#acq_basket').length) {
      // hide row 'managed by'
      $('#acqui_basket_summary #managedby').hide();
      // hide row 'Library'
      $('#acqui_basket_summary #branch').hide();
    }

    // Detect circulation page
    if ($('#circ_circulation').length) {
      $('#onsite_checkout').change(function() {
        if ($('#duedatespec')) {
          // need to do this because the datepicker forces a date into the #duedatespec input
          setTimeout(function() {
            $('#cleardate').trigger("click");
          }, 10);
        }
      });
      // When the username 'xg00623' is logged in...
      if ($('.loggedinusername').text() === 'xg00623') {
        $("#show-checkout-settings > a").click();

        $('#onsite_checkout').prop('checked', true).change();
      }

    }

    if ($('#pat_moremember').length) {
      $("#pat_moremember #patron-messaging-prefs").find("input").prop('disabled', true);
    }

    /* #### ADDING SELECT INSTEAD OF SIMPLE INPUT FOR RESTRICTIONS #### */

    if ($('#pat_memberentrygen').length || $('#pat_moremember').length) {
      var $selector = $("#manual_restriction_form #debarred_comment");
      if ($('#pat_moremember').length) {
        $selector = $("#manual_restriction_form #rcomment")
      }
      $selector.before('<select id="restriction_reason"><option value="">Välj orsak</option><option value="Webbregistrering">Webbregistrering</option><option value="GU-spärr">GU-spärr</option><option value="Specialhant. låntagare">Specialhant. låntagare</option><option value="Obetald räkning">Obetald räkning</option></select>');

      $selector.hide();

      $('#manual_restriction_form #restriction_reason').on('change', function() {
        $selector.val(this.value).change();
        if ($selector.val() === "") {
          $('#add_debarment').val(0);
        }
      })
    }
    /* ###### END RESTRICTION CODE ###### */


    // detect catalog detail page
    if ($('#catalog_detail').length) {
      // hide opac-link
      $('#catalogue_detail_biblio span.results_summary > a[href*="/opac-detail.pl"]').parent().hide()
    }

    if ($('#catalog_results').length) {
      // hide opac-link
      $('#catalog_results span.view-in-opac').hide()
    }
  });




})(jQuery);