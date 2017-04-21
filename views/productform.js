﻿$('#save-product-button').on('click', function(e)
{
	e.preventDefault();

	var redirectDestination = '/products';
	var returnTo = Grocy.GetUriParam('returnto');
	if (returnTo !== undefined)
	{
		redirectDestination = returnTo + '?createdproduct=' + encodeURIComponent($('#name').val());
	}

	if (Grocy.EditMode === 'create')
	{
		Grocy.PostJson('/api/add-object/products', $('#product-form').serializeJSON(),
			function(result)
			{
				window.location.href = redirectDestination;
			},
			function(xhr)
			{
				console.error(xhr);
			}
		);
	}
	else
	{
		Grocy.PostJson('/api/edit-object/products/' + Grocy.EditObjectId, $('#product-form').serializeJSON(),
			function(result)
			{
				window.location.href = redirectDestination;
			},
			function(xhr)
			{
				console.error(xhr);
			}
		);
	}
});

$(function()
{
	$('#barcode-taginput').tagsManager({
		'hiddenTagListName': 'barcode',
		'tagsContainer': '#barcode-taginput-container'
	});

	if (Grocy.EditMode === 'edit')
	{
		Grocy.FetchJson('/api/get-object/products/' + Grocy.EditObjectId,
			function (product)
			{
				if (product.barcode !== null && product.barcode.length > 0)
				{
					product.barcode.split(',').forEach(function(item)
					{
						$('#barcode-taginput').tagsManager('pushTag', item);
					});
				}
			},
			function(xhr)
			{
				console.error(xhr);
			}
		);
	}

	$('#qu_factor_purchase_to_stock').trigger('change');
	$('#name').focus();
	$('#product-form').validator();
	$('#product-form').validator('validate');

	var prefillName = Grocy.GetUriParam('prefillname');
	if (prefillName !== undefined)
	{
		$('#name').val(prefillName);
		$('#name').focus();
	}

	var prefillBarcode = Grocy.GetUriParam('prefillbarcode');
	if (prefillBarcode !== undefined)
	{
		$('#barcode-taginput').tagsManager('pushTag', prefillBarcode);
		$('#name').focus();
	}
});

$('.input-group-qu').on('change', function(e)
{
	var factor = $('#qu_factor_purchase_to_stock').val();
	if (factor > 1)
	{
		$('#qu-conversion-info').text('This means 1 ' + $("#qu_id_purchase option:selected").text() + ' purchased will be converted into ' + (1 * factor).toString() + ' ' + $("#qu_id_stock option:selected").text() + ' in stock.');
		$('#qu-conversion-info').show();
	}
	else
	{
		$('#qu-conversion-info').hide();
	}
});
