<script lang="ts">
  const statuses = [200, 404, 301, 102]
  const methods = ['GET', 'PUT', 'POST', 'DELETE']
  const logs = [...Array(20).keys()].map((_, i) => ({
    time: new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'long'
    }).format(Date.now() - i * 1000),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    host: 'https://hello-world-shiny-star-f6bf.workflow.ipvm.dev',
    request: methods[Math.floor(Math.random() * methods.length)],
    message: 'Here is a relevant message'
  }))

  const STATUS_CODE_COLOURS = {
    102: 'bg-odd-blue-100 text-odd-blue-900 border border-odd-blue-400',
    200: 'bg-odd-green-100 text-odd-green-900 border border-odd-green-400',
    301: 'bg-odd-yellow-100 text-odd-gray-900 border border-odd-yellow-400',
    404: 'bg-odd-red-100 text-odd-red-900 border border-odd-red-400'
  }
</script>

<div class="w-full overflow-x-auto">
  <table class="table table-xs table-pin-rows table-pin-cols w-full">
    <thead>
      <tr class="bg-odd-gray-50 border-t border-y-odd-gray-0 text-base-content">
        <th class="bg-transparent" />
        <td class="py-2 bg-odd-gray-50 capitalize text-label-sm">Time</td>
        <td class="py-2 bg-odd-gray-50 capitalize text-label-sm text-center">
          Status
        </td>
        <td class="py-2 bg-odd-gray-50 capitalize text-label-sm text-center">
          Request
        </td>
        <td class="py-2 bg-odd-gray-50 capitalize text-label-sm">Host</td>
        <td class="py-2 bg-odd-gray-50 capitalize text-label-sm">Message</td>
      </tr>
    </thead>
    <tbody class="divide-y divide-base-300 border-t border-y-odd-gray-500">
      {#each logs as log, i}
        <tr
          class="bg-odd-gray-0 text-input-m group transition-colors duration-200 ease-in-out hover:bg-odd-teal-50"
        >
          <th
            class="py-2 px-4 bg-clip-padding text-input-m text-center transition-colors duration-200 ease-in-out bg-transparent group-hover:bg-odd-teal-50"
          >
            {i + 1}
          </th>
          <td
            class="py-2 text-input-m transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-teal-50"
          >
            {log.time}
          </td>
          <td
            class="py-2 text-input-m transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-teal-50 text-center"
          >
            <span
              class="{STATUS_CODE_COLOURS[
                log.status
              ]} px-1 rounded-sm text-input-sm inline-block"
            >
              {log.status}
            </span>
          </td>
          <td
            class="py-2 text-input-m transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-teal-50 text-center"
          >
            {log.request}
          </td>
          <td
            class="py-2 text-input-m transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-teal-50"
          >
            {log.host}
          </td>
          <td
            class="py-2 text-input-m transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-teal-50"
          >
            {log.message}
          </td>
        </tr>
      {/each}
    </tbody>
    <!-- <tfoot>
      <tr>
        <th />
        <td>Time</td>
        <td>Status</td>
        <td>Host</td>
        <td>Request</td>
        <td>Message</td>
        <th />
      </tr>
    </tfoot> -->
  </table>
</div>
